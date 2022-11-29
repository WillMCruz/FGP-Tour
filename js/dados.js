/**
 * salvar
 * Salva os dados do formulário na collection do Firebase
 * @param {object} event - Evento do objeto que foi clicado
 * @param {string} collection - Nome da collection que será salva no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection){
    event.preventDefault() // evita que o formulário seja recarregado
    //Verificando os campos obrigatórios
    if(document.getElementById('nome').value === '') { alert('⚠ É obrigatório informar o nome!')}
    else if(document.getElementById('email').value === '') { alert('⚠ É obrigatório informar o email!')}
    else if(document.getElementById('pacote').value === '') { alert('⚠ É obrigatório informar o pacote!')}
    else if(document.getElementById('datavl').value === '') { alert('⚠ É obrigatório informar a data da viagem!')}
    else if(document.getElementById('valorvl').value === '') { alert('⚠ É obrigatório informar o valor da viagem!')}
    else if(document.getElementById('id').value !==''){
        alterar(event, collection)
    }
    else {incluir(event, collection)}
}

function incluir(event, collection){
    event.preventDefault() // evita que o formulário seja recarregado
    //Obtendo os campos do formulário
    const form = document.forms[0]
    const data = new FormData(form)
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries())
    //console.log(`Os dados são:`)
    //console.log(values)
    //O retorno é uma Promise (promessa)
   return firebase.database().ref(collection).push(values)
    .then(()=> {
        alert('✔ Registro cadastrado com sucesso!')
        document.getElementById('formCadastro').reset() //limpar o formulário
    })
    .catch(error => {
        console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
        alert(`❌ Falha ao incluir: ${error.message}`)
    })
}

/**
 * obtemDados.
 * Obtém os dados da collection a partir do Firebase.
 * @param {string} collection - Nome da Collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */
function obtemDados(collection){
    var tabela = document.getElementById('tabelaDados')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-warning'
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Sexo'
        cabecalho.insertCell().textContent = 'Email'
        cabecalho.insertCell().textContent = 'Pacote'
        cabecalho.insertCell().textContent = 'Data'
        cabecalho.insertCell().textContent = 'Valor'
        cabecalho.insertCell().textContent = 'Forma'
        cabecalho.insertCell().textContent = 'Opções'

        snapshot.forEach(item => {
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] //collection
            let id = item.ref.path.pieces_[1] //id
            let registro = JSON.parse(JSON.stringify(item.val()))
            //Criando as novas linhas na tabela
            let novalinha = tabela.insertRow()
            novalinha.className = 'table-dark'
            novalinha.insertCell().textContent = item.val().nome
            novalinha.insertCell().textContent = item.val().sexo
            novalinha.insertCell().textContent = item.val().email
            novalinha.insertCell().textContent = item.val().pacote
            novalinha.insertCell().textContent = item.val().datavl
            novalinha.insertCell().textContent = item.val().valorvl
            novalinha.insertCell().textContent = item.val().formapg
           
            
            novalinha.insertCell().innerHTML = 
            `
            <button class ='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')>🗑 Excluir </button>
            <button class ='btn btn-warning' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')>✏ Editar </button>
            `
        })
        let rodape = tabela.insertRow()
        rodape.className = 'table-warning'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
    })
}

/** 
 * totalRegistros.
 * Retorna a contagem total do número de registros da collection informada
 * @param {string} collection - Nome da Collection no Firebase
 * @return {string} - Texto com o total de registros
* */
function totalRegistros(collection){
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() === 0) {
            retorno = '‼ Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}
/**
 *  Remover
 *  Remove os dados da collection a partir do id informado
 * @parem {string} db - Nome da collection no firebase
 * @parem {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */
function remover(db, id){
    //iremos confirmar com usuário
   if(window.confirm('!!Confirma a exclusão do registro?')){
        let dadoExclusao = firebase.database().ref().child(db+'/'+id)
        dadoExclusao.remove()
        .then(()=> {
            alert('✅Registro removido com sucesso!')
        })
        .catch(error =>{
            alert('❌Falha ao excluir: '+error.message)
        })
    }
}

function carregaDadosAlteracao(db, id){
    firebase.database().ref(db).on('value', (snapshot)=> {
        snapshot.forEach(item => {
            if(item.ref.path.pieces_[1]===id){
                //se for igual ao id,iremos igualar os campos
                document.getElementById('id').value = item.ref.path.pieces_[1]
                document.getElementById('nome').value = item.val().nome
                document.getElementById('email').value = item.val().email
                document.getElementById('pacote').value = item.val().pacote
                document.getElementById('datavl').value = item.val().datavl
                document.getElementById('valorvl').value = item.val().valorvl

                if(item.val().sexo==='Masculino')
                {
                    document.getElementById('sexoM').checked = true
                }
                else
                {
                    document.getElementById('sexoF').checked = true
                }

                if(item.val().formapg==='Á Vista'){
                    document.getElementById('formapgvs').checked = true
                }
                else if(item.val().formapg==='Crédito'){
                    document.getElementById('formapgcred').checked = true
                }
                else
                {
                    document.getElementById('formapgpix').checked = true
                }
            }
        })
    })
}

function alterar(event, collection) {
    event.preventDefault()
    //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    console.log(values)
    //Enviando os dados dos campos para o Firebase
    return firebase.database().ref().child(collection + '/' + values.id).update({
      nome: values.nome,    
      sexo: values.sexo,    
      email: values.email,
      pacote: values.pacote,
      datavl: values.datavl,
      valorvl: values.valorvl,
      formapg: values.formapg
    })
      .then(() => {
        alert('✅ Registro alterado com sucesso!')
        document.getElementById('formCadastro').reset()
      })
      .catch(error => {
        console.log(error.code)
        console.log(error.message)
        alert('❌ Falha ao alterar: ' + error.message)
      })
  }