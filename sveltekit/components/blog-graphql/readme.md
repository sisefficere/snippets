# Blog via GraphQL

Componente utiliza a API GraphQL do Wordpress (plugin WP GraphQL) para requisitar os posts e realizar paginação por cursor (método nativo do GraphQL)

<br>

## Problemas e soluções

- Erro de CORS no recebimento da resposta da requisição: causado pela falta do header `Access-Control-Allow-Origin` no servidor.

> Há soluções baseadas na alteração do arquivo `.htaccess` constante na pasta raiz do Wordpress, porém a que funcionou no caso desta implementação foi adicionar o código abaixo no arquivo *functions.php* (ou em algum plugin). Os outros cabeçalhos foram adicionados por precaução, mas a ausência possivelmente não altera o resultado.

```php
function add_cors_http_header(){
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Methods:GET,POST,OPTIONS");
    header("Access-Control-Allow-Headers:*");
}
add_action('init','add_cors_http_header');
```

- Erros estranhos na resposta como "Erro 500" do wordpress: possivelmente causados por erro de sintaxe na requisição GraphQL.

> Busque no código por ausência de chaves, variáveis ou vírgulas a mais, por exemplo. No caso de variáveis, **a última não deve possuir vírgula**!

<br>

## Query

- Variáveis: `after`, `before`, `first`, `last`.
- Conteúdo (`nodes`): data, conteudo (em html), resumo (em html), url da imagem destaque do post, categorias do post, título (em html) e slug.
- Paginação (`pageInfo`): `hasNextPage`, `endCursor`, `hasPreviousPage`, `startCursor`

```graphql
query Ultimos4Posts($after: String = "", $before: String = "", $first: Int = 10, $last: Int = 10) {
    posts(after: $after, before: $before, first: $first, last: $last) {
        nodes {
            date
            content(format: RENDERED)
            excerpt(format: RENDERED)
            featuredImage {
                node {
                    guid
                }
            }
            terms {
                nodes {
                    ... on Category {
                        name
                    }
                }
            }
            title(format: RENDERED)
            slug
        }
        pageInfo {
            hasNextPage
            endCursor
            hasPreviousPage
            startCursor
        }
    }
}
```

<br>

## Dependências

Componente utiliza a reatividade que o sveltekit dispõe por meio de declarações (`$:`). Também utiliza a diretiva `on:click` nos botões de navegação. Para o consumo da API é utilizado o bloco `#await` do Svelte, o que facilita o processo e melhora a interação com a interface pois torna fácil a implementação de um loader.

<br>

## Funcionamento

Praticamente baseado na reatividade e na declaração e modificação da variável `variables` que é responsável pelas variáveis da requisição GraphQL.
- Variáveis: `variables`, `getPosts`
    - Variáveis de ambiente (env): `VITE_ENDPOINT_GRAPHQL`
- Métodos: `homePage`, `previousPage`, `nextPage`
    - Método reativo: `posts` (vinculado à `variables`).
- Verificações:
    - Para exibição dos botões de paginação: `hasPreviousPage` (exibe botões *página anterior* e *início*), `hasNextPage` (exibe o botão de *próxima página*).

### Variáveis

**`variables`**

> Possui o valor padrão abaixo e é alterado somente por meio dos métodos `homePage`, `previousPage`, `nextPage`. Tal ação é o gatilho para o efeito reativo e faz com que o método `posts` seja reexecutado, atualizando a constante `getPosts` e, consequentemente, a exibição dos posts.

```javascript
`{
    "first": 6,
    "after": null,
    "last": null,
    "before": null
}`
```

**`VITE_ENDPOINT_GRAPHQL`**

> Variável de ambiente que armazena o endpoint para as requisições GraphQL.

**`getPosts`**

> É definida em escopo declarativo/reativo e assume o valor da função `posts` que recebe a variável `variables` por referência.

```javascript
$: getPosts = posts(variables);
```

### Métodos

**`posts`**

- **Parâmetros**: `variables`
- **Constantes**: `query`, `data`, `res`
- **Métodos**: `fetch`

```javascript
const posts = async (variables) => {
    
    variables, query, data, res, fetch

    return data;
};
```

- *parâmetro* `variables`: representa as variáveis da requisição GraphQL, utilizadas para a paginação por cursor.

> É utilizada a variável de mesmo nome para ser passada como referência.

- *constante* `query`: consulta a ser realizada pela requisição.

```javascript
const query = `
    query Ultimos4Posts($after: String = "", $before: String = "", $first: Int = 10, $last: Int = 10) {
        posts(after: $after, before: $before, first: $first, last: $last) {
            nodes {
                date
                content(format: RENDERED)
                excerpt(format: RENDERED)
                featuredImage {
                    node {
                        guid
                    }
                }
                terms {
                    nodes {
                        ... on Category {
                            name
                        }
                    }
                }
                title(format: RENDERED)
                slug
            }
            pageInfo {
                hasNextPage
                endCursor
                hasPreviousPage
                startCursor
            }
        }
    }
`;
```

- *constante* `res`: resposta da requisição fetch para o endpoint GraphQL

```javascript
const res = await fetch(endpoint,{init})
```
- *método* `fetch`: realiza a requisição com o tipo JSON via POST.

```javascript
fetch(`${import.meta.env.VITE_ENDPOINT_GRAPHQL}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        query,
        variables,
    }),
});
```

- *constante* `data`: armazena a resposta da requisição convertida para JSON.

```javascript
const data = await res.json();
```

---

**`homePage`**

- **Variáveis**: `variables`

> Método é chamado pelo botão de início (home) e reseta o valor da variável para ser realizada a consulta inicial.

```javascript
function homePage() {
    variables
};
```

- *variável* `variables`: é resetada para o valor padrão, como resultado os primeiros posts são apresentados.

```javascript
variables=`{
    "first": 6,
    "after": null,
    "last": null,
    "before": null
}`
```

---

**`previousPage`**

- **Parâmetros**: `startCursor`
- **Variáveis**: `variables`

> Método é chamado pelo botão de página anterior e utiliza o cursor inicial e a variável `last` para realizar a consulta que retorna os posts da página anterior.

```javascript
function previousPage(startCursor) {
    variables
}
```

- *parâmetro* `startCursor`: string que referencia o local onde começa os posts da página atual.
- *variável* `variables`: define a variável last com o número de posts a ser mostrado e before com o cursor inicial, o que faz com que a consulta retorne os posts da página anterior.

```javascript
variables = `{
    "first": null,
    "after": null,
    "last": 6,
    "before": "${startCursor}"
}`;
```

---

**`nextPage`**

- **Parâmetros**: `endCursor`
- **Variáveis**: `variables`

> Método é chamado pelo botão de próxima página e utiliza o cursor final e a variável `first` para realizar a consulta que retorna os posts da página anterior.

```javascript
function nextPage(endCursor) {
    variables
}
```

- *parâmetro* `endCursor`: string que referencia o local onde termina os posts da página atual.
- *variável* `variables`: define a variável last com o número de posts a ser mostrado e before com o cursor final, o que faz com que a consulta retorne os posts da próxima página.

```javascript
variables = `{
    "first": 6,
    "after": "${endCursor}",
    "last": null,
    "before": null
}`;
```
