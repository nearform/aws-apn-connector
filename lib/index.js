import playwright from 'playwright'
import * as XLSX from 'xlsx/xlsx.mjs'

/**
 * The APN client. Instances encapsulates the APN client and all of its functions in order to allow multiple instances each with a different authentication credential to be in existence in parallel.
 */
export class Client {
  /**
   * Initializes and configures the client for the APN Connector. This does not authenticate, use the async #connect method to do so as you see fit.
   * @param {object} options the options to pass to playwright. This also can be provided the browserType attribute which will allow you to specify the browser instance to use ('webkit', 'chromium', 'firefox'))
   */
  constructor(options = {}) {
    this.options = options
    this.browserType = options.browserType || 'chromium'
    this._browser = null
    this._context = null
  }

  /**
   * Open a new browser instance, if one isn't already available, and authenticate with the APN. This must be run before any and all other subsequent functions. This does not re-authenticate if an authentication session expires, that is left to the user of the library to handle as they see appropriate.
   * @param {string} username the APN username to authenticate with
   * @param {string} password the APN password to authenticate with
   * @returns This instance of the client, allowing for chaining of functions
   */
  async connect(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Authentication credentials are required')
      }
      if (!this._browser) {
        this._browser = await playwright[this.browserType].launch(this.options)
        this._context = await this._browser.newContext()
      }
      const page = await this._context.newPage()
      await page.goto(
        'https://partnercentral.awspartner.com/partnercentral2/s/login'
      )
      await page.getByLabel('*Business email').fill(username)
      await page.getByLabel('*Password').fill(password)
      await page.getByRole('button', { name: 'Sign in' }).click()

      // wait for the authenticated dashboard page to load
      // try {
        await page.waitForSelector('p.welcomeUser')
      // } catch (e) {
      //   //sometime the APN doesn't auth the first time.
      //   await page.getByLabel('*Business email').fill(username)
      //   await page.getByLabel('*Password').fill(password)
      //   await page.getByRole('button', { name: 'Sign in' }).click()
      //   await page.waitForSelector('p.welcomeUser')
      // }
      return this
      // _page = page
      // return page
    } catch (e) {
      throw new Error(
        'Authentication with the APN was unsuccessful. Please check your credentials and try again.'
      )
    }
  }

  /**
   * Gathers an export of all active users within the APN. This is the same as the "Export All" button on the Users page. This will pull ALL registered users, not just Alliance team members, and as such may take a period of time to complete and return a large result set.
   * @returns {Promise} a promise that resolves to an array of objects representing the users in the APN. Each object contains the following properties:
   * - Full Name: the full name of the user
   * - Contact Type: The type of contact the user is (Alliance, Sales, etc.)
   * - Title: the title of the user
   * - Email: the email address of the user
   * - T&C Account Email Entered: whether or not the user has entered an email address for the T&C account (true/false)
   * - Phone: the phone number of the user
   */
  async usersAll() {
    const page = await this._context.newPage()
    await page.goto(
      'https://partnercentral.awspartner.com/UserAdministrationPage'
    )
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: '[Export All]' }).click()
    const workbook = await Client.downloadExcelFile(downloadPromise)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(worksheet)
  }

  /**
   * Deactivates a user from the APN by their name. This is the same as the "Deactivate" button on the Users page. This will deactivate the user regardless of their contact type (Alliance, Sales, etc.). Note: use of this function is irreversible and will require manual intervention to re-activate the user. Furthermore, this function CAN be used to deactivate yourself, so use with caution.
   * @param {string} name Should be the exact name of the user to deactivate. This is NOT case sensitive. It should be an identifier to yield a single individual. If more than one result is returned, an error will be thrown and no user(s) will be deactivated.
   * @returns true if the user was deactivated successfully
   * @throws {Error} if the name provided yields zero (not found) or multiple (ambiguous) results) matches from the name. Note that if an exception is thrown, no users will be deactivated, failing safely.
   */
  async usersDeactivateByName(name) {
    const page = await this._context.newPage()
    await page.goto(
      'https://partnercentral.awspartner.com/UserAdministrationPage'
    )
    await page.waitForSelector('input[name="j_id0\\:form\\:j_id14\\:j_id49"]')

    await page
      .locator('input[name="j_id0\\:form\\:j_id14\\:j_id49"]')
      .fill(name)
    await page
      .locator('input[name="j_id0\\:form\\:j_id14\\:j_id49"]')
      .press('Enter')

    // wait for the XHR request to finish before executing further
    await page.waitForLoadState('networkidle')

    // If anything other than 1 result is returned, throw an error.
    const count = await page.getByRole('link', { name: 'Deactivate' }).count()
    if (count !== 1) {
      throw new Error(
        `Expected 1 result for name "${name}", got ${count}. Failing safely, no users were deactivated.`
      )
    }
    page.once('dialog', dialog => {
      dialog.accept()
    })
    await page.getByRole('link', { name: 'Deactivate' }).click()
    return true
  }

  /**
   * The initialization and authentication process to establish an authenticated session with the APN. This must be run before any and all other subsequent functions. This does not re-authenticate if an authentication session expires, that is left to the user of the library to handle as they see appropriate.
   * @returns {Promise} a promise that resolves when the authenticated session is fully queried and returned with the list of opportunities as a JSON Object.
   * @throws {Error} if the excel file (and file conversion to JSON) cannot be completed as expected error is thrown. Reasons include: Not authenticated, issue with the APN site, etc.
   */
  async opportunitiesAll() {
    const page = await this._context.newPage()
    // Go to the opportunity list page to access the functions enabled there
    await page.goto(
      'https://partnercentral.awspartner.com/partnercentral2/s/pipeline-manager',
      { waitUntil: 'domcontentloaded' }
    )
    // await page.getByRole('button', { name: 'View opportunities' }).click();
    await page.getByRole('textbox', { name: 'Bulk actions' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page
      .getByText('Export Opportunities - All Opportunities', {
        exact: true
      })
      .click()

    const workbook = await Client.downloadExcelFile(downloadPromise)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(worksheet)
  }

  /**
   *
   * @param {string} id ID of the opportunity to update, this should be the AWS opportunity ID value
   * @param {string} targetState the target state to transition the opportunity to. This should be one of the following values:
   * @returns true if the opportunity was updated successfully
   */
  async opportunitiesUpdate(id, targetState) {
    const page = await this._context.newPage()
    // Go to the opportunity list page to access the functions enabled there
    await page.goto(
      'https://partnercentral.awspartner.com/partnercentral2/s/pipeline-manager',
      { waitUntil: 'domcontentloaded' }
    )
    // From all opportunties page
    await page.waitForSelector('input.input-search')
    await page.type('input.input-search', id)
    await page.$x(`//a[contains(text(), '${id}')]`)[0].click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    // Individual Opportunity Page
    await page.click('input[data-id="select-sobject-id"]')
    await page.$x(`//a[contains(text(), '${targetState}')]`)[0].click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    // Change State Page
    await page.click('.primary .slds-button')
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    return true
  }

  /**
   * Gathers an export of all certifications within the APN. This is the same as the "Export All" button on the Certifications page. This will pull ALL registered certifications, not just Alliance team members, and as such may take a period of time to complete and return a large result set.
   * @returns {Promise} a promise that resolves to an array of objects representing the certifications registered in the APN. Each object contains the following properties:
   */
  async certificationsAll() {
    const page = await this._context.newPage()
    await page.goto(
      'https://partnercentral.awspartner.com/partnercentral2/s/awscertifications'
    )
    const certifications = await Client.getXLSX(
      page,
      'https://partnercentral.awspartner.com/PartnerCertificationDetailsExport'
    )
    return Client.xlsxToJSON(certifications, { type: 'string' })
  }

  /**
   * Extracts the current Partner Scorecard from the AWS Partner Network (APN) and returns it as a JSON object.
   * @returns {Promise} a promise that resolves to an object containing the following properties:
   * - partnerId: the partner ID of the APN account
   * - tierReviewDate: the date the tier review is due
   * - companyName: the name of the company
   * - feeRenewalDate: the date the APN fee is due
   * - partnerPath: the current partner path
   * - pathStage: the current path stage
   * - currentAPNProgramFee: the current APN program fee
   * - yearlyAPNProgramFee: the yearly APN program fee
   * - knowledge: an object containing the following properties:
   *  - accreditedIndividuals: an object containing the following properties:
   *   - currentTier: an object containing the following properties:
   *     - achieved: the number of accredited individuals achieved
   *     - target: the number of accredited individuals required to achieve the next tier
   *   - upgradeTier: an object containing the following properties:
   *     - achieved: the number of accredited individuals achieved
   *     - target: the number of accredited individuals required to achieve the next tier
   *  - technicalAccreditedIndividuals: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *  - businessAccreditedIndividuals: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *  - foundationalCertifiedIndividuals: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *  - technicalCertifiedIndividuals: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *  - technicalCertifiedIndividualsProOrSpecialty: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of accredited individuals achieved
   *      - target: the number of accredited individuals required to achieve the next tier
   * - experience: an object containing the following properties:
   *  - launchedOpportunities: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of launched opportunities achieved
   *      - target: the number of launched opportunities required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of launched opportunities achieved
   *      - target: the number of launched opportunities required to achieve the next tier
   * - monthlyRecurringRevenue: an object containing the following properties:
   *   - currentTier: an object containing the following properties:
   *    - achieved: the amount of monthly recurring revenue achieved
   *      - target: the amount of monthly recurring revenue required to achieve the next tier
   *  - upgradeTier: an object containing the following properties:
   *   - achieved: the amount of monthly recurring revenue achieved
   *  - target: the amount of monthly recurring revenue required to achieve the next tier
   * - customerSuccess: an object containing the following properties:
   *  - publiclyReferenceableCustomers: an object containing the following properties:
   *     - currentTier: an object containing the following properties:
   *       - achieved: the number of publicly referenceable customers achieved
   *       - target: the number of publicly referenceable customers required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of publicly referenceable customers achieved
   *      - target: the number of publicly referenceable customers required to achieve the next tier
   *  - customerSatisfactionResponses: an object containing the following properties:
   *    - currentTier: an object containing the following properties:
   *      - achieved: the number of customer satisfaction responses achieved
   *      - target: the number of customer satisfaction responses required to achieve the next tier
   *    - upgradeTier: an object containing the following properties:
   *      - achieved: the number of customer satisfaction responses achieved
   *      - target: the number of customer satisfaction responses required to achieve the next tier
   * 
   */
  async scorecard() {
    const page = await this._context.newPage()
    await page.goto(
      'https://partnercentral.awspartner.com/partnercentral2/s/scorecard'
    )

    await page.waitForSelector('p.field-title.header-title')
    const partnerId = (
      await page.locator('small').first().textContent()
    ).replace('Partner ID ', '')

    const tierReviewDate = await Client.scorecardBlock(page, 'Tier Review Date')
    const companyName = await Client.scorecardBlock(page, 'Company Name')
    const feeRenewalDate = await Client.scorecardBlock(
      page,
      'APN Fee Renewal Date'
    )
    const partnerPath = await Client.scorecardBlock(page, 'Partner Path')
    const pathStage = await Client.scorecardBlock(page, 'Path Stage')
    const currentAPNProgramFee = await Client.scorecardBlock(
      page,
      'Current APN Program Fee'
    )
    const yearlyAPNProgramFee = await Client.scorecardBlock(
      page,
      'Yearly APN Program Fee'
    )

    const accreditedIndividuals = await Client.scorecardRow(
      page,
      'AWS Accredited Individuals'
    )
    const technicalAccreditedIndividuals = await Client.scorecardRow(
      page,
      'Technical',
      2
    )
    const businessAccreditedIndividuals = await Client.scorecardRow(
      page,
      'Business',
      2
    )
    const foundationalCertifiedIndividuals = await Client.scorecardRow(
      page,
      'AWS Foundational Certified Individuals'
    )
    const technicalCertifiedIndividuals = await Client.scorecardRow(
      page,
      'AWS Technical Certified Individuals'
    )
    const technicalCertifiedIndividualsProOrSpecialty =
      await Client.scorecardRow(
        page,
        'AWS Technical Certified Individuals Pro or Specialty'
      )

    const launchedOpportunities = await Client.scorecardRow(
      page,
      'Launched Opportunities'
    )
    const monthlyRecurringRevenue = await Client.scorecardRow(
      page,
      'Monthly Recurring Revenue Minimum'
    )

    const publiclyReferenceableCustomers = await Client.scorecardRow(
      page,
      'Publicly Referenceable Customers'
    )

    const customerSatisfactionResponses = await Client.scorecardRow(
      page,
      'Customer Satisfaction Responses'
    )
    

    return {
      partnerId,
      tierReviewDate,
      companyName,
      feeRenewalDate,
      partnerPath,
      pathStage,
      currentAPNProgramFee,
      yearlyAPNProgramFee,
      knowledge: {
        accreditedIndividuals,
        technicalAccreditedIndividuals,
        businessAccreditedIndividuals,
        foundationalCertifiedIndividuals,
        technicalCertifiedIndividuals,
        technicalCertifiedIndividualsProOrSpecialty
      },
      experience: {
        launchedOpportunities,
        monthlyRecurringRevenue
      },
      customerSuccess: {
        publiclyReferenceableCustomers,
        customerSatisfactionResponses
      }
    }
  }

  /**
   * Close the browser instance and thereby the client. This will terminate all session information and require re-authentication to use the client again.
   * @returns {Promise} a promise that resolves when the browser has fully closed, terminating all session information.
   */
  async end() {
    return this._browser ? this._browser.close() : Promise.resolve()
  }

  /**
   * Find the ancestor node from the provide provided element that matches the provided match function.
   * @param {object} element the starting element to begin searching its ancestors for a match 
   * @param {function} match the function to use to match the ancestor element, must return true or false 
   * @returns {object} the element in the ancsestor chain that matches the provided match function
   */
  static async ancestor(element, match) {
    let parent = await element.locator('..')
    let found = await match(parent)
    while (!found) {
      parent = await parent.locator('..')
      found = await match(parent)
    }
    return parent
  }

  /**
   * Query the scorecard block information from the APN and return the text content of the block.
   * @param {object} page the starting locator element to begin searching for the scorecard block 
   * @param {string} blockName the target name/text to work from to find the scorecard block
   * @returns {string} the text content of the scorecard block
   */
  static async scorecardBlock(page, blockName) {
    const target = await page.getByText(blockName).first()
    const block = await Client.ancestor(target, async element => {
      const classNames = (await element.getAttribute('class')) || ''
      return classNames.includes('slds-col')
    })
    return (await block.textContent()).replace(blockName, '').trim()
  }

  /**
   * Helper function to parse targeted valeus from the APN scorecard. This is used to parse the X of Y values from the scorecard.
   * @param {string} content the textual content to parse for the targeted value (X of Y)
   * @returns {object} an object containing the achieved and target values OR the original value if not of format X of Y
   */
  static targetedValue(content) {
    if ((content||'').includes(' of ')) {
      const parts = content.split(' of ')
      return {
        achieved: parseInt(parts[0].replace(/[^0-9]/g, ''), 10),
        target: parseInt(parts[1].replace(/[^0-9]/g, ''), 10)
      }
    } else return (content|| '')
  }

  /**
   * Parses the information for the scorecard row from the APN and returns the current tier and upgrade tier values.
   * @param {object} page the starting/root element to query from
   * @param {string} blockName the text name of the scorecard row to query for
   * @param {integer} nth the nth row to query for, defaults to 0
   * @returns {object} object returning the current tier and upgrade tier values for the scorecard row
   */
  static async scorecardRow(page, blockName, nth = 0) {
    const rowLabel = await page.getByText(blockName).locator(`nth=${nth}`)
    const row = await Client.ancestor(rowLabel, async element => {
      const classNames = (await element.getAttribute('class')) || ''
      return classNames.includes('plrs-scorecard-req')
    })

    const currentTierRaw = await row
      .locator('.grid-cell')
      .locator('nth=1')
      .textContent()
    const currentTier = Client.targetedValue(currentTierRaw)

    const upgradeTierRaw = await row
      .locator('.grid-cell')
      .locator('nth=2')
      .textContent()
    const upgradeTier = Client.targetedValue(upgradeTierRaw)

    return {
      currentTier,
      upgradeTier
    }
  }

  /**
   * Helper function to download an excel file from the APN and return it as an XLSX Workbook object.
   * @param {promise} downloadPromise A promise that resolves to a download request stream.
   * @returns An XLSX Workbook object
   */
  static async downloadExcelFile(downloadPromise) {
    const download = await downloadPromise
    const downloadStream = await download.createReadStream()
    const buffers = []
    for await (const chunk of downloadStream) {
      buffers.push(chunk)
    }
    return XLSX.read(Buffer.concat(buffers), { type: 'buffer' })
  }

  /**
   * Helper function to download a CSV file from the APN through a in-browser javascript context using the browsers fetch method and return it as a string.
   * @param {Page} _page The playwright browser page to use to execute the fetch command
   * @param {string} url url to query for the fetch command
   * @returns A string of the requested resource
   */
  static async getXLSX(_page, url) {
    const csv = await _page.evaluate(async url => {
      const d = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
      return d.text()
    }, url)
    return csv
  }
  static xlsxToJSON(csv, options = {}) {
    const workbook = XLSX.read(csv, options)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(worksheet)
  }
}

export default {
  Client
}
