// import puppeteer from 'puppeteer'
import playwright from 'playwright'
import * as XLSX from 'xlsx/xlsx.mjs'

async function downloadExcelFile(downloadPromise) {
  const download = await downloadPromise
  const downloadStream = await download.createReadStream()
  const buffers = []
  for await (const chunk of downloadStream) {
    buffers.push(chunk)
  }
  return XLSX.read(Buffer.concat(buffers), { type: 'buffer' })
}
export function Client(options = {}) {
  let _browser = null
  let _context = null
  let _page = null
  // eslint-disable-next-line no-unused-vars
  const apn = {
    connect: async (username, password) => {
      try {
        if (!username || !password) {
          throw new Error('Authentication credentials are required')
        }
        if (!_browser) {
          let browserType = 'chromium'
          if (options.browserType) {
            browserType = options.browserType // could be firefox or webkit
          }
          _browser = await playwright[browserType].launch(options)
          _context = await _browser.newContext()
        }
        const page = await _context.newPage()
        await page.goto(
          'https://partnercentral.awspartner.com/partnercentral2/s/login'
        )
        await page.getByLabel('*Business email').fill(username)
        await page.getByLabel('*Password').fill(password)
        await page.getByRole('button', { name: 'Sign in' }).click()

        // wait for the authenticated dashboard page to load
        await page.waitForSelector('p.welcomeUser')
        _page = page
        return page
      } catch (e) {
        throw new Error(
          'Authentication with the APN was unsuccessful. Please check your credentials and try again.'
        )
      }
    },
    users: {
      allAllianceTeamMembers: async () => {},
      allActive: async () => {
        const page = _page
        await page.goto(
          'https://partnercentral.awspartner.com/UserAdministrationPage'
        )
        const downloadPromise = page.waitForEvent('download')
        await page.getByRole('link', { name: '[Export All]' }).click()
        const workbook = await downloadExcelFile(downloadPromise)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        return XLSX.utils.sheet_to_json(worksheet)
      },
      // Must be exact name and only that name in the registration
      deactivateByName: async name => {
        const page = _page
        await page.goto(
          'https://partnercentral.awspartner.com/UserAdministrationPage'
        )
        await page.waitForSelector(
          'input[name="j_id0\\:form\\:j_id14\\:j_id49"]'
        )
        await page
          .locator('input[name="j_id0\\:form\\:j_id14\\:j_id49"]')
          .fill(name)
        await page
          .locator('input[name="j_id0\\:form\\:j_id14\\:j_id49"]')
          .press('Enter')
        await page.waitForTimeout(1000)
        // If anything other than 1 result is returned, throw an error.
        const count = await page
          .getByRole('link', { name: 'Deactivate' })
          .count()
        if (count !== 1) {
          throw new Error(
            `Expected 1 result for name "${name}", got ${count}. Failing safely, no users were deactivated.`
          )
        }
        page.once('dialog', dialog => {
          console.log(`Dialog message: ${dialog.message()}`)
          dialog.accept()
        })
        await page.getByRole('link', { name: 'Deactivate' }).click()
        return true
      }
    },
    opportunities: {
      all: async () => {
        const page = _page
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

        const workbook = await downloadExcelFile(downloadPromise)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        return XLSX.utils.sheet_to_json(worksheet)
      },
      changeState: async (id, targetState) => {
        const page = _page
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
        return 'OK'
      }
    },
    certifications: {
      all: async () => {
        const certifications = await getCSV(
          _page,
          'https://partnercentral.awspartner.com/PartnerCertificationDetailsExport'
        )
        return certificationsCSVtoJSON(certifications, { type: 'string' })
      }
    },
    end: async () => {
      return _browser ? _browser.close() : Promise.resolve()
    }
  }

  return apn
}

export async function getCSV(_page, url) {
  const csv = await _page.evaluate(async url => {
    const d = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    return d.text()
  }, url)
  return csv
}
export function certificationsCSVtoJSON(csv, options = {}) {
  const workbook = XLSX.read(csv, options)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(worksheet)
}
