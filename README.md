# AWS Amazon Partner Network (APN) API

![Digital Bridge to AWS APN](/public/apn-connector.png)

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

#### System Requirements

These are driven by the requirements for Playwright, which specifies these baseline operating environments.
* Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
* MacOS 12 Monterey or MacOS 13 Ventura.
* Debian 11, Debian 12, Ubuntu 20.04 or Ubuntu 22.04, with x86-64 or arm64 architecture.

### Installing

Install the library from npm.

```shell
npm i @nearform/aws-apn-connector
```

## Usage

Import the Client function from the index.js file and create a new instance. You can then use the connect method to authenticate and the users.deactivateByEmail method to deactivate a user. Please note that at this time there is no re-authentication model implemented within the library, so implementations are bound to the standard web session authentication length of time. That said the only penalty for authentication before each transaction is time roughly 2 seconds (there appears to be no throttling otherwise).

```js
import { Client } from 'aws-apn-connector'

async function main () {
  // can pass in parameters for playwright to the Client constructor and it will apply them to the playwright instance
  const client = new Client()

  // executes against the web portal to create session
  await client.connect('username', 'password')

  // gets all certifications from the website
  const isRemoved = await client.users.deactivateByName('Irene Cara')  // Take your passion and make it happen.

  // gets all certifications from the website
  const certifications = await client.certifications.all()

  // gets all registered opportunities from the website
  const opportunities = await client.opportunities.all()

  await client.close()
}

main()
```

## As-A-Service

This library has been built in a manner that it can be exposed as a web API service (code available at [./samples/server.js](./samples/server.js)). There is also a `Containerfile` associated with this repository that can be used either directly or with enhancement to create a container deployable instance of this service into any container fabric. For either of these workflows to work, you will need to set environment variables for `APN_USERNAME` and `APN_PASSWORD` with your appropriate credentails.

## Documentation 

The library is pretty simple and I always welcome pull requests, but if you just want to consume the library, please find [the documentation here](https://nearform.github.io/aws-apn-connector/).


## Built With
* [Playwright](https://playwright.dev/) - For headless chrome (by default, can change via configuration if desired) interactions with the AWS APN
* [XLSX](https://www.npmjs.com/package/xlsx) - Used to handle Excel files - The preferred data format for everything AWS APN.

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/nearform/aws-apn-connector/blob/main/LICENSE.md) file for details
