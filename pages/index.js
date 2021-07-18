import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'


function ProfileSidebar(propriedades){
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}} />
      <hr />
      <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
      @{propriedades.githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{propriedades.title} ({propriedades.items.length})</h2>
      {/* <ul>
        {propriedades.items.lista.map((itemAtual, index) =>  {
                        
          return  (
          <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.title}`}>
                <img src={`https://github.com/${itemAtual.login}.png`} alt="" />
                <span>{itemAtual.login}</span>
              </a>
          </li>
          ) 
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  )
}

function ListaLateralDireita(propriedades){
  return (
    <ul>
      {propriedades.lista.map((item, index) =>  {
          const isObjeto = typeof item !== "string"
        
          return index < 6 ? (
          <li key={isObjeto ? item.id : item}>
              <a href={`https://github.com/${isObjeto ? item.creatorSlug : item}`}>
                <img src={isObjeto ? item.imageUrl : `https://github.com/${item}.png`} alt="" />
                <span>{isObjeto ? item.title : item}</span>
              </a>
          </li>
          ) : ''
        })}
      </ul>
  )
}

export default function Home() { 
  const githubUser = 'DiiDenis';
  const [comunidades, setComunidades] =  React.useState([]) 
  const pessoasFavoritas = [
    'juunegreiros', 
    'DiiDenis', 
    'peas', 
    'omariosouto', 
    'marcobrunodev',
    'rafaballerini'
  ]

  const [seguidores, setSeguidores] = React.useState([])

  React.useEffect(function(){
    fetch('https://api.github.com/users/peas/followers')
    .then(resposta => resposta.json())
    .then(respostaCompleta => setSeguidores(respostaCompleta))

    // GraphQl
    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers:{
        'Authorization': '714a984190975fae869e56c4d609ed',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: ` query { 
                  allCommunities { 
                    title
                    imageUrl
                    id
                    creatorSlug
                  } 
                }`
      }),
    }).then(resposta => resposta.json())
    .then(respostaCompleta => {
      const comunidadesDatoCms = respostaCompleta.data.allCommunities
      setComunidades(comunidadesDatoCms)
    })




  },[])

  return (
    <>
    <AlurakutMenu  githubUser={githubUser}/>
    <MainGrid>
      <div className="profileArea" style={{gridArea:'profileArea'}}>
        <ProfileSidebar githubUser={githubUser} />
      </div>
      <div className="welcomeArea" style={{gridArea:'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem vindo
          </h1>
          <OrkutNostalgicIconSet/>
        </Box>
        <Box>
         <h2 className="subTitle">O que você deseja fazer?</h2>
         <form onSubmit={function handleCriarComunidade(e){
           e.preventDefault()
           const dadosDoForm = new FormData(e.target)  

           const comunidade = {
            title: dadosDoForm.get('title'),
            imageUrl: dadosDoForm.get('image'),
            creatorSlug: githubUser
           }

           fetch('/api/comunidades', {
             method: 'POST',
             headers:{
              'Content-Type': 'application/json',
            },
             body: JSON.stringify(comunidade)
           }).then(async (response) => {
              const dados = await response.json()
              const registroCriado = dados.registroCriado;
              const comunidadesAtualizadas = [...comunidades, registroCriado]
              setComunidades(comunidadesAtualizadas)   
           })

               
         }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
            <input 
                placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa"
                type="text"
              />
            </div>
            <button>
              Criar comunidade
            </button>
         </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea:'profileRelationsArea'}}>
        <ProfileRelationsBox title="Seguidores" items={seguidores}/>

        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">Meus amigos ({pessoasFavoritas.length})</h2>
          <ListaLateralDireita lista={pessoasFavoritas} />
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">Minhas comunidades ({comunidades.length})</h2>
          <ul>
            {comunidades.map((item, index) =>  {
                return index < 6 ? (
                <li key={item.id}>
                    <a href={`/comunidades/${item.id}`}>
                      <img src={item.imageUrl} alt="" />
                      <span>{item.title}</span>
                    </a>
                </li>
                ) : ''
              })}
            </ul>
        </ProfileRelationsBoxWrapper>
        
      </div>
      
      
    </MainGrid>
    </>
  )
 
}
