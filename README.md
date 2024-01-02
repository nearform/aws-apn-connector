# AWS Amazon Partner Network (APN) API

This project is a web automation tool that uses [Playwright](https://playwright.dev/) to interact with the [AWS Partner Network (APN)](https://aws.amazon.com/partners/) website, because they do not provide an API. It provides functionalities such as:
- Authentication with the APN
- Get all registered certifications for the partner
- Get all registered opportunities and their status for the partner
- Get all registered and active users
- Deactivate a user with a provided name - must resolve to a single unique user. **NOTE:** It does not currently handle if the same name applies to two different individuals, in this case it will fail safely and throw an error.


## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You need to have Node.js installed on your machine to run this project. You can [download it from here](https://nodejs.org/).

### Installing

Clone the repository

```
git clone https://github.com/voodootikigod/aws-apn-connector
```

Navigate into the project directory

```
cd aws-apn-connector
```

Install the dependencies

```
npm install
```

## Usage

Import the Client function from the index.js file and create a new instance. You can then use the connect method to authenticate and the users.deactivateByEmail method to deactivate a user. Please note that at this time there is no re-authentication model implemented within the library, so implementations are bound to the standard web session authentication length of time. That said the only penalty for authentication before each transaction is time roughly 2 seconds (there appears to be no throttling otherwise).

```
import { Client } from './index.js'

async function main () {
  const client = new Client()

  // executes against the web portal to create session
  await client.connect('username', 'password')

  // gets all certifications from the website
  const certifications = await client.certifications.all()

  // gets all registered opportunities from the website
  const opportunities = await client.opportunities.all()

  await client.close()
}

main()
```


## Built With
* [Playwright](https://playwright.dev/) - For headless chrome (by default, can change via configuration if desired) interactions with the AWS APN
* [XLSX](https://www.npmjs.com/package/xlsx) - Used to handle Excel files - The preferred data format for everything AWS APN.

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/voodootikigod/aws-apn-connector/blob/main/LICENSE.md) file for details
