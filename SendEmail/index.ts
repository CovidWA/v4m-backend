import { AzureFunction, Context, HttpRequest } from "@azure/functions"

function validateEmail(email: string): boolean {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const recipient_email = (req.query.recipient_email || (req.body && req.body.recipient_email));
    const recipient_name = (req.query.recipient_name || (req.body && req.body.recipient_name));
    const sender_name = (req.query.sender_name || (req.body && req.body.sender_name));
    const sender_email = (req.query.sender_email || (req.body && req.body.sender_email));

    context.log(`*** email sending: ${sender_name} ${sender_email}`);

    if (!(validateEmail(recipient_email) && recipient_name && sender_name && validateEmail(sender_email))) {
        context.bindings.res = {
            status: 400,
            headers: {
                'content-type':'application/json',
            },
            body: { status: "Error" },
        };
        return;   
    }

    context.bindings.res = {
        status: 200,        
        headers: {
            'content-type':'application/json',
        },
        body: { status: "OK" },
    };

    context.bindings.message = {
        personalizations: [
            {
                to: [
                    {
                        email: recipient_email,
                        name: recipient_name,
                    }
                ],
                dynamic_template_data:
                {            
                    first_name: recipient_name,
                    sender_name: sender_name,
                    sender_email: sender_email,
                },
            },
        ],
        template_id:"d-1e6fef32876b4abb8d478ce5c99533c3",
        from: {
            email: "info@vaccinatefor.me",
            name: "Vaccinate For Me",
        }
    };
    

};

export default httpTrigger;