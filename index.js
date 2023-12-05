import puppeteer from "puppeteer";
import XLSX from "xlsx";

export function Client(puppeteerOptions = {}) {
  let _browser = null;
  let _page = null;
  let _viewId = null;
  return {
    connect: async (username, password) => {
      if (!username || !password) {
        throw new Error("Authentication credentials are required");
      }
      if (!_browser) {
        _browser = await puppeteer.launch(puppeteerOptions);
      }
      const page = await _browser.newPage();
      await page.goto("https://partnercentral.awspartner.com/APNLogin", {
        waitUntil: "networkidle2",
      });

      // email
      const emailInput = "#loginPage\\:loginForm\\:registerWhoEmailInput";
      await page.type(emailInput, username);

      // password
      const passInput = "#loginPage\\:loginForm\\:registerPassPasswordInput";
      await page.type(passInput, password);

      await page.click("#loginPage\\:loginForm\\:loginBtn");
      await page.waitForNavigation({ waitUntil: "networkidle2" });

      // go to the home
      await page.waitForSelector(".plrs-badge");
      // const blueButtonLink = await page.evaluate(() => {
      //   return document.querySelectorAll('.blueButtonLink')[1].href;
      // });
      // _viewId = blueButtonLink.split('viewId=')[1];

      _viewId = "a3H0h000000pQEbEAM";
      console.log("Authenticated into the APN");
      _page = page;
      return page;
    },
    _opportunitiesXLSXtoJSON: (xlsx, options = {}) => {
      const workbook = XLSX.read(xlsx, options);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(worksheet);
    },
    _certificationsCSVtoJSON: (csv, options = {}) => {
      const workbook = XLSX.read(csv, options);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(worksheet);
    },
    opportunities: async () => {
      const page = _page;
      // Go to the opportunity list page to access the functions enabled there
      await page.goto(
        "https://partnercentral.awspartner.com/OpportunityListPage",
        { waitUntil: "domcontentloaded" }
      );
      await page.waitForNavigation({ waitUntil: "networkidle2" });

      const viewId = await page.evaluate(() => {
        const ocText = document
          .querySelectorAll("#editcustomviewlink")[0]
          .onclick.toString();
        const id = ocText.split("'")[1];
        return id;
      });

      // When settled, access the packaged functions to trigger/enable
      // visualforce to prepare the data then gather via fetch the excel
      // file and return
      const opportunityXLSX = await page.evaluate(async (viewId) => {
        await opportunityExportPreConfirmation(viewId);
        const url = `https://partnercentral.awspartner.com/ExportXls?viewId=${viewId}&fs=PartnerOpportunityExport`;
        const d = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        return d.text();
      }, viewId);

      // convert to json objects
      return _opportunitiesXLSXtoJSON(opportunityXLSX, { type: "string" });
    },
    certifications: async () => {
      const certifications = await _getCSV(
        "https://partnercentral.awspartner.com/PartnerCertificationDetailsExport"
      );
      return _certificationsCSVtoJSON(certifications, { type: "string" });
    },
    _getCSV: async (url) => {
      const csv = await _page.evaluate(async (url) => {
        const d = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        return d.text();
      }, url);
      return csv;
    },
    end: async () => {
      return _browser ? _browser.close() : Promise.resolve();
    },
  };
}
