## Aware JS - Node JS Error Notifications

An easy way to send emails notifications with stack trace whenever an error occurs on the server for Node JS applications.

![awarejs example](awarejs-example.png?raw=true "AwareJS Example")

## Installation
### via npm
```
npm install awarejs --save
```

## Usage

- After installing, create an AwareJS class object and initialise it using these configurations.
```
let options = {
    mailer: {
        credentials: { // Node mailer initialization options
            host: 'smtp.mailtrap.io',
            port: '2525',
            secure: false,
            auth: {
                user: 'MAIL_USERNAME',
                pass: 'MAIL_PASSWORD',
            }
        },
        config: { // Node mailer message configuration options
            to: 'someone@email.com',
            from: 'noreply@email.com',
        },
    },
    params: {
        footer: {
            unsubscribe: {
                link: 'LINK_TO_UNSUBSCRIBE_ELSE_NULL',
            }
        }
    },
    debug: true, // prints console.log() wherever needed to debug the issue
};

const aware = new Aware(options);
const errorObj = new Error('Hello World Test Error');
aware.setError(errorObj);
aware.trigger();
// aware.trigger([ { name: 'URL', value: 'https://someurl.com' } ]); with extra info to include at last of the email.
```

## Available Methods
| Method Name | Description | Required |
| ------- | :--------------:| -------- |
| **setError(errorObj)** | *This method takes in the error object which consumes the error and extract required information from it. It also prepares error data to be triggered via email.* | Yes |
| **setupMailer(setMailerConfig)** | *This method takes in the credentials for Nodemailer to initialize it. Check [NodeMailer Docs](https://nodemailer.com/) for setting up the mail client. You can also pass `mailer.credentials` in constructor object to initialize it while object creation* | Optional |
| **setMailerConfig(config)** | *This method takes in the message configurations defined in [NodeMailer Message Docs](https://nodemailer.com/message/). You can also pass `mailer.config` in constructor object to initialize it while object creation* | Optional |
| **setDontReportErrors(errorNamesArr)** | *This method takes in an array of error names (as in `error.constructor.name`) and makes sure that names inside this array should be neglected for triggering out the emails/notifications to* | Optional |
| **trigger(extraInfo)** | *This method takes in an array of objects (e.g.: `[ { name: 'URL', value: 'https://someurl.com' } ]`) which could be added as an extra information at the end of the email* | Yes |
| **test(extraInfo)** | *This method can be used to test the working of this module. After executing this method you should receive a test email to make sure everything is working fine.* | Optional |

## Security
If you find any security related issue, please email saumya.rastogi04@gmail.com instead of using the issue tracker.

# License
The MIT License. Please see [License File](LICENSE.md) for more information.