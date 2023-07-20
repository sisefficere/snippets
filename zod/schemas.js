z.object({
  nome: z.string().regex(/^[A-Za-záàâãäéèêëíïóôõöüúçñÁÀÂÃÄÉÈËÍÏÓÔÕÖÚÜÇÑ\s]{1,}$/g, {
    message: "Nome inválido! Não insira números ou caracteres especiais."
  }),
  telefone: z.string().regex(/(?:^\(?[0]?[1-9]{2}\)?[\.\-\s]?|^[0]?[1-9]{2}[\.\-\s]?)[9]?[1-9]\d{3}[\.\-\s]?\d{4}$/g, {
    message: "Número inválido! Inclua o DDD, com ou sem parênteses."
  }),
  cidade: z.string().trim().regex(/^[A-Za-záàâãäéèêëíïóôõöüúçñÁÀÂÃÄÉÈËÍÏÓÔÕÖÚÜÇÑ\s]{2,30}$/g, {
    message: "Nome da cidade inválido! Não insira números ou caracteres especiais. Máximo de 30 caracteres."
  }),
  endereco: z.string().max(160, {
    message: "Endereço muito longo! Insira no máximo 160 caracteres."
  }),
  whatsapp: z.any().optional(),
  plano: z.string(),
  motivo: z.string().min(1),
  instagramAmigo: z.string().max(20, {
    message: "Nome de usuário muito longo! Insira no máximo 30 caracteres."
  }).optional(),
  nota: z.number().positive().min(1, {
    message: "Defina uma nota de 0 a 10."
  }).max(10, {
    message: "Nota inválida! Classifique de 0 a 10."
  }),
  email: z.string().email({
    message: "E-mail inválido! Certifique-se de ter o inserido corretamente."
  }).optional(),
  relato: z.string().min(1).max(1000, {
    message: "Relato muito longo! Máximo de 1000 caracteres."
  }),
  pagina: z.string(),
  "cf-turnstile-response": z.any()
})