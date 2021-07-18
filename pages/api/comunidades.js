import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response){
    if(request.method == 'POST'){
        const TOKEN = 'c558ebc8f276750ce93241944c4ce3'
        const client = new SiteClient(TOKEN)
    
        const registroCriado = await client.items.create({
            itemType: "970948", // Id do model de "comunities" criado pelo Dato
            ...request.body,
        })
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no Get, mas o POST tem!'
    })
}