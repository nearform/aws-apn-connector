import { faker } from "@faker-js/faker";

const d = (idx) => {
  if ([].includes(idx)) {
    return faker.address.country();
  }
  if ([1, 64].includes(idx)) {
    return faker.name.fullName();
  }

  return faker.random.alpha(10);
};
const rowTemplate = () => {
  const rows = [];
  for (let a = 0; a < 70; a++) {
    rows.push(
      `<Cell ss:StyleID="colData"><Data ss:Type="String">${d(a)}</Data></Cell>`
    );
  }

  return `<Row>${rows.join("\n")}</Row>`;
};

export function opportunities(rows = 10) {
  const data = [];
  for (let i = 0; i < rows; i++) {
    data.push(rowTemplate());
  }
  return Buffer.from(
    `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <Styles>
        <Style ss:ID="colHeader">
            <Alignment ss:Vertical="Center" ss:WrapText="1"></Alignment>
            <Borders></Borders>
            <Font ss:Bold="1" ss:FontName="Calibri"></Font>
            <Interior ss:Color="#e5e6e8" ss:Pattern="Solid"></Interior>
            <NumberFormat></NumberFormat>
            <Protection></Protection>
        </Style>    
        <Style ss:ID="colData">
            <Alignment></Alignment>
            <Borders></Borders>
            <Font ss:FontName="Calibri"></Font>
            <Interior></Interior>
            <NumberFormat></NumberFormat>
            <Protection></Protection>
        </Style>    
    </Styles>
    
    <Worksheet ss:Name="Report"><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
            <Selected></Selected>
            <FreezePanes></FreezePanes>
            <FrozenNoSplit></FrozenNoSplit>
            <Zoom>90</Zoom>
        </WorksheetOptions>
        <Table x:FullColumns="1" x:FullRows="1"><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column>
        <Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column>
        <Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column>
        <Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column>
        <Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column><Column ss:AutoFitWidth="1" ss:Width="100"></Column>    
            <Row ss:Height="50"><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:0:j_id9">Opportunity Id</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:1:j_id9">Created By</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:2:j_id11">Date Created(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:3:j_id11">Last Updated Date(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:4:j_id9">Customer Company Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:5:j_id9">Customer Email</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:6:j_id9">Partner Project Title</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:7:j_id9">Project Description/Business Need</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:8:j_id9">Additional Comments</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:9:j_id9">Next Step</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:10:j_id9">Stage</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:11:j_id11">Target Close Date(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:12:j_id9">Closed Reason</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:13:j_id9">Estimated AWS Monthly Recurring Revenue</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:14:j_id9">Delivery Model</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:15:j_id9">Is Opportunity from Marketing Activity?</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:16:j_id9">Other Competitors</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:17:j_id9">Competitive Tracking</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:18:j_id9">Use Case</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:19:j_id9">Sub Use Case</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:20:j_id9">Contract Vehicle</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:21:j_id9">RFx/Public Tender Solicitation No.</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:22:j_id9">AWS Marketing Salesforce Campaign Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:23:j_id9">Marketing Activity Channel</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:24:j_id9">Marketing Activity Use-Case</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:25:j_id9">Was Marketing Development Funds Used?</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:26:j_id9">APN Programs</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:27:j_id9">Is this for Marketplace?</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:28:j_id9">Partner Primary Need from AWS</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:29:j_id9">AWS Account ID</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:30:j_id9">Did AWS Account Rep support you on this?</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:31:j_id9">Is This Net New Engagement With Customer</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:32:j_id9">Partner CRM Unique Identifier</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:33:j_id9">Primary Contact First Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:34:j_id9">Primary Contact Last Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:35:j_id9">Primary Contact Email</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:36:j_id9">Primary Contact Phone</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:37:j_id9">Primary Contact Title</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:38:j_id9">Procurement Type</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:39:j_id9">Customer Software Value</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:40:j_id11">Contract Effective Date/Term Start Date(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:41:j_id11">Contract Expiration Date(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:42:j_id9">Solution Tenancy</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:43:j_id9">Customer Software Value Currency</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:44:j_id9">Status</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:45:j_id9">Customer First Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:46:j_id9">Customer Last Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:47:j_id9">Customer Title</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:48:j_id9">Customer Phone</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:49:j_id9">AWS Sales Rep Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:50:j_id9">AWS Sales Rep Email</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:51:j_id9">Primary Contact Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:52:j_id9">Lead Source</span></Data></Cell>
            <Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:53:j_id9">Created Date</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:54:j_id9">Last Modified Date</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:55:j_id9">Country</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:56:j_id9">Biz Unit</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:57:j_id9">Customer Website</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:58:j_id9">If Other, please describe your needs</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:59:j_id11">Date Submitted(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:60:j_id11">Date Approved/Rejected(MM/DD/YYYY)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:61:j_id9">Industry Vertical</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:62:j_id9">Industry Other</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:63:j_id9">Opportunity Ownership</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:64:j_id9">Opportunity Owner Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:65:j_id9">Opportunity Owner Email (Formula)</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:66:j_id9">AWS Partner Success Manager Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:67:j_id9">AWS Partner Success Manager Email</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:68:j_id9">AWS ISV Success Manager (ISM) Name</span></Data></Cell><Cell ss:StyleID="colHeader"><Data ss:Type="String"><span id="j_id0:j_id7:69:j_id9">AWS ISV Success Manager (ISM) Email</span></Data></Cell></Row>
            ${data.join("\n")}
        </Table></Worksheet>
</Workbook>`,
    "utf8"
  );
}
