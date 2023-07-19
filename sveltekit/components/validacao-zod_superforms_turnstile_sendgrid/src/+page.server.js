import { redirect } from '@sveltejs/kit';
import { fail} from '@sveltejs/kit';
import {z} from "zod";
import {superValidate, message} from "sveltekit-superforms/server"

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
  
  // validação com zod
  const validaFormPrincipal = z.object({
    nome: z.string().regex(/^[A-Za-záàâãäéèêëíïóôõöüúçñÁÀÂÃÄÉÈËÍÏÓÔÕÖÚÜÇÑ\s]{1,}$/g,{
      message:"Nome inválido! Não insira números ou caracteres especiais."
    }),
    telefone: z.string().regex(/(?:^\(?[0]?[1-9]{2}\)?[\.\-\s]?|^[0]?[1-9]{2}[\.\-\s]?)[9]?[1-9]\d{3}[\.\-\s]?\d{4}$/g,{
      message: "Número inválido! Inclua o DDD, com ou sem parênteses."
    })
  })

  export async function load(event) {
    const formPrincipal = await superValidate(event, validaFormPrincipal)
    return{
        form: formPrincipal()
    }
  }

  export const actions = {
    principal: async (event) => {
        const form = await superValidate(event, validaFormPrincipal)
    
        if(form.valid){  
          // campos
          const nome = form.data.nome;
          const telefone = form.data.telefone;
          const token = form.data['cf-turnstile-response']
    
          const {success, error} = await validateToken(token, import.meta.env.VITE_TURNSTILE_SECRET)
    
          if(success){
            // e-mail com sendgrid
            event.fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SENDGRID_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                'from': {
                  'email': 'sistemas@grandmom.com.br'
                },
                'personalizations': [
                  {
                    'to': [
                      {
                        'email': 'ronymarcon@gmail.com'
                      }
                    ],
                    "cc": [
                      {
                        'email': 'michel@sisefficere.com.br'
                      },
                      {
                        'email': 'mullersmartmedia@gmail.com'
                      },
                    ],
                    'dynamic_template_data': {
                      "titulo": "Chegou um novo lead!",
                      "nome": nome,
                      'fields': [
                        {
                          'label': "Telefone",
                          'value': telefone
                        },
                        {
                          'label': "Cidade",
                          'value': cidade
                        }
                      ],
                      'url': `${import.meta.env.VITE_URL_SITE}${pagina}`,
                      'formulario': "Principal",
                      'assunto': `LEAD - Informações - ${import.meta.env.VITE_NOME_SITE}`
                    }
                  }
                ],
                'template_id': 'd-9bfbb92ac02846839786a15eb28e8d71'
              })
            })

            // redireciona o usuário
            throw redirect(303, '/obrigado');
            // ou retorna uma mensagem de sucesso para o cliente
            // return message(form, 'Sua avaliação foi enviada!');
          }else{
            // este método do superforms já aciona o método fail do sveltekit e retorna ao cliente o erro
            return message(form, `${error === "missing-input-response" ? "Realize a verificação abaixo." : "Formulário já enviado!"}`, {
              status: 400
          });
          }
    
        }else{
          return fail(400,{
            form
          })
        }
      },
  }