'use strict';
const apn = require('./lib/apn');
const { getChrome } = require('./chrome-script');


module.exports= {
  opportunities: async (event) => {
    const chrome = await getChrome();
    await apn.init({chrome});
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v3.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  },
  certifications: async (event) => {
    const chrome = await getChrome();
    await apn.init({chrome});
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v3.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  }
};
