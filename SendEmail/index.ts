import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.log(`*** HTTPExample name: ${name}`);

    context.bindings.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

    context.bindings.message = {
        subject: `Thanks for your order (#${name})!`,
        content: [{
            type: 'text/plain',
            value: `${name}, your order (${name}) is being processed!`
        }]
    };
    

};

export default httpTrigger;