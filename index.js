// import puppeteer from 'puppeteer'
import playwright from 'playwright'
import * as XLSX from 'xlsx/xlsx.mjs'

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
          _browser = await playwright.chromium.launch(options)
          _context = await _browser.newContext()
        }
        const page = await _context.newPage()
        await page.goto(
          'https://partnercentral.awspartner.com/partnercentral2/s/login'
        )
        await page.getByLabel('*Business email').fill(username)
        await page.getByLabel('*Password').fill(password)
        await page.getByRole('button', { name: 'Sign in' }).click()
        // need to handle jitter
        await page.waitForTimeout(2000)
        await page.waitForURL('**/s/')
        _page = page
        return page
      } catch (e) {
        throw new Error(
          'Authentication with the APN was unsuccessful. Please check your credentials and try again.'
        )
      }
    },
    users: {
      deactivateByEmail: async email => {
        const page = _page
        await page.goto(
          'https://partnercentral.awspartner.com/UserAdministrationPage'
        )
        const user = await page.waitForSelector(`a ::-p-text(${email}`)
        console.log(user)
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
        const download = await downloadPromise
        const downloadStream = await download.createReadStream()
        const buffers = []
        for await (const chunk of downloadStream) {
          buffers.push(chunk)
        }
        var workbook = XLSX.read(Buffer.concat(buffers), { type: 'buffer' })
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
