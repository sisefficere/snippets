// valida com turnstile
async function validateToken(token, secret) {
    const response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                response: token,
                secret: secret,
            }),
        },
    );
  
    const data = await response.json();
  
    return {
        // Return the status
        success: data.success,
        // Return the first error if it exists
        error: data['error-codes']?.length ? data['error-codes'][0] : null,
    };
  }

  export const actions = {
    default: async (event) => {
        const {success, error} = await validateToken(token, import.meta.env.VITE_TURNSTILE_SECRET)

        if(success){
            // executa o código
        }else{
            // trata o erro utilizando método fail (do próprio sveltekit) ou o método message (do superforms)
        }
    }
  }