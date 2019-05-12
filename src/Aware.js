'use strict'

const ejs = require('ejs');
const path = require('path');
const ErrorStackParser = require('error-stack-parser');
const NodeMailer = require('nodemailer');

const Helpers = require('./utilities/helpers');

class Aware {

    constructor(options = {}) {
        this.options = options;
        this.mailConfig = {};
        this.templateOptions = {};
        this.errorObj = new Error('Test Error - Aware JS is working like a charm :)');
        this.dontReportErrors = [];

        // this.validateOptions(options);

        this.prepareErrorData();
        this.setupMailer(options.mailer.credentials);
        this.setMailerConfig(options.mailer.config);
    }

    validateOptions(options) {
        if(! 'mailer' in options) {
            throw new Error("No mailer options provided. Please specify mailer in options.");
        } else if (! 'credentials' in options.mailer) {
            throw new Error("No credentials for mailer is provided. Please specify credentials in mailer.");
        } else if (! 'config' in options.mailer) {
            throw new Error("No config for mailer is provided. Please specify config in mailer.");
        }
    }

    setError(error) {
        this.errorObj = error;
        this.prepareErrorData();
    }

    prepareErrorData() {
        this.errData = ErrorStackParser.parse(this.errorObj);

        this.errData = this.errData.map((obj, key) => {
            let str = `at ${obj.functionName} (${obj.fileName}:${obj.lineNumber}:${obj.columnNumber})`;
            return Object.assign({}, obj, { string: str })
        });

        let footerText = Helpers.getObjProp(this.options, 'params.footer.unsubscribe.text');
        if(footerText == '') {
            footerText = null;
        }
        
        this.errDataObj = {
            error: {
                className: this.errorObj.constructor.name,
                message: this.errorObj.message,
                stack: this.errData,
            },
            extras: {
                infoArr: [
                    // { name: 'URL', value: null },
                    // { name: 'Logged In User', value: null },
                ],
            },
            params: {
                footer: {
                    unsubscribe: {
                        link: Helpers.getObjProp(this.options, 'params.footer.unsubscribe.link'),
                        text: footerText ? footerText : `You are receiving this email because you have visited our site or asked us about regular newsletter.`,
                    }
                }
            }
        };
    }
    
    setupMailer(credentials) {
        this.mailTransporter = NodeMailer.createTransport(credentials);
    }

    setMailerConfig(defaultConfig) {
        this.mailConfig = Object.assign({}, this.mailConfig, {
            subject: '[Test]',
        }, defaultConfig);

        this.mailConfig.subject = `${this.mailConfig.subject} - Aware JS`;
        return this;
    }

    trigger(params = []) {
        this.errDataObj['extras']['infoArr'] = params;

        if(! this.isErrorValidToTrigger()) {
            return;
        }

        ejs.renderFile(path.resolve(__dirname, '../templates/default.ejs'), this.errDataObj, this.templateOptions, (err, htmlStr) => {
            if(this.options.debug) {
                console.log(err, htmlStr);
            }
        
            this.mailTransporter.sendMail(Object.assign({}, this.mailConfig, {
                html: htmlStr,
            }))
            .then(data => {
                if(this.options.debug) {
                    console.log("=========>> Mail Triggered <<<=========", data);
                }
                return data;
            })
            .catch(error => {
                return error;
            });
        });
    }

    setDontReportErrors(errorNamesArr) {
        this.dontReportErrors = Array.from(new Set([ ...this.dontReportErrors, ...errorNamesArr ]));
    }

    isErrorValidToTrigger() {
        return ! this.dontReportErrors.includes(
            Helpers.getObjProp(this.errDataObj, 'error.className')
        );
    }

    test(params = []) {
        this.trigger(params);
    }

}

module.exports = Aware;