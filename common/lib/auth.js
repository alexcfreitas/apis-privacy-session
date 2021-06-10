'use strict';

const buildIAMPolicy = (assetId, effect, resource, context) => {
    
    const policy = {
        principalId: assetId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };

    return policy;
};

module.exports = {
    buildIAMPolicy
};
