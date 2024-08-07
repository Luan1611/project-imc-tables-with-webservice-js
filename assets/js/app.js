// Luan Marqueti

function adicionarLinha(e) {

    e.preventDefault();

    let inputNome = document.querySelector('#nome').value;
    let inputPeso = parseFloat(document.querySelector('#peso').value);
    let inputAltura = parseFloat(document.querySelector('#altura').value);

    if (inputNome == "" || isNaN(inputPeso) || isNaN(inputAltura)) {

        console.error("Preencha todos os campos.");

    } else {

        let tabela = document.querySelector("#tabela tbody");

        if (inputPeso <= 0 || inputAltura <= 0) {

            console.error("Valores inválidos");

        } else {

            let options = {
                method: "POST",
                body: JSON.stringify({
                    nome: inputNome,
                    peso: inputPeso,
                    altura: inputAltura
                }),
                headers: {
                    "Content-type": "application/json"
                }
            }
            fetch("https://ifsp.ddns.net/webservices/imc/pessoa", options).then(
                (respostaDoServidor) => {
                    if (respostaDoServidor.ok) {
                        console.log("Código de resposta: " + respostaDoServidor.status);
                        return respostaDoServidor.json();
                    } else {
                        alert(`Erro. Pessoa não inserida. Código de resposta: ${respostaDoServidor.status}`);
                    }
                }
            ).then((pessoa) => {

                let tbody = document.querySelector("#tabela tbody");

                let linhaTabela = document.createElement("tr");
                linhaTabela.classList.add("tupla");
                let qtdeAtributosDaPessoa = Object.keys(pessoa).length;

                for (let indiceDoAtributo = 0; indiceDoAtributo < qtdeAtributosDaPessoa; indiceDoAtributo++) {
                    let celulaDaLinha = document.createElement("td");
                    celulaDaLinha.innerText = Object.values(pessoa)[indiceDoAtributo];
                    linhaTabela.append(celulaDaLinha);
                }

                let celulaDaLinha = document.createElement("td");
                bExcluir = document.createElement("button");
                bExcluir.innerText = "Excluir";
                bExcluir.classList.add("excluir");
                bExcluir.addEventListener("click", excluirLinha);

                bAumentarPeso = document.createElement("button");
                bAumentarPeso.innerText = "+ Peso";
                bAumentarPeso.classList.add("acrescPeso");
                bAumentarPeso.addEventListener("click", acrescentarPeso);

                bDiminuirPeso = document.createElement("button");
                bDiminuirPeso.innerText = "- Peso";
                bDiminuirPeso.classList.add("diminPeso");
                bDiminuirPeso.addEventListener("click", diminuirPeso);

                celulaDaLinha.append(bExcluir);
                celulaDaLinha.append(bAumentarPeso);
                celulaDaLinha.append(bDiminuirPeso);

                linhaTabela.append(celulaDaLinha);

                tbody.append(linhaTabela);

                alert("Pessoa adicionada com sucesso!");

            })

        }

    }
}


function acrescentarPeso(e) {

    let botaoAumentarPeso = e.target;
    let pesoPessoa = botaoAumentarPeso.parentElement.parentElement.children[3];
    let idPessoa = botaoAumentarPeso.parentElement.parentElement.children[0].innerHTML;

    let valorPeso = parseFloat(pesoPessoa.innerHTML);

    let options = {
        method: "PUT",
        body: JSON.stringify({
            peso: valorPeso + 0.5
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

    let urlComIdDaPessoaParaAtualizarPeso = `https://ifsp.ddns.net/webservices/imc/pessoa/${idPessoa}`;
    fetch(urlComIdDaPessoaParaAtualizarPeso, options).then(
        (respostaDoServidor) => {
            if (respostaDoServidor.ok) {
                console.log("Código de resposta: " + respostaDoServidor.status);
                return respostaDoServidor.json();
            } else {
                alert(`Erro. Peso não atualizado. Código de resposta: ${respostaDoServidor.status}`);
            }
        }
    ).then((pessoa) => {

        let novoPeso = Object.values(pessoa)[3];
        //porque (pesoPessoa contém o innerHTML na declaração)
        //pesoPessoa = novoPeso.toString();
        //não da certo e assim (abaixo) da?
        pesoPessoa.innerHTML = novoPeso;

        let novoImc = Object.values(pessoa)[4];

        let imcPessoa = botaoAumentarPeso.parentElement.parentElement.children[4];
        imcPessoa.innerHTML = novoImc;

        let novoStatus = Object.values(pessoa)[5];
        let statusPessoa = botaoAumentarPeso.parentElement.parentElement.children[5];
        statusPessoa.innerHTML = novoStatus;

        alert("Peso atualizado com sucesso!");

    })

}


function diminuirPeso(e) {

    let botaoDiminuirPeso = e.target;
    let pesoPessoa = botaoDiminuirPeso.parentElement.parentElement.children[3];
    let idPessoa = botaoDiminuirPeso.parentElement.parentElement.children[0].innerHTML;

    let valorPeso = parseFloat(pesoPessoa.innerHTML);

    let options = {
        method: "PUT",
        body: JSON.stringify({
            peso: valorPeso - 0.5
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

    if (valorPeso <= 0.5) {

        alert("Peso não atualizado. O valor do peso deve ser maior do que zero.");

    } else {

        let urlComIdDaPessoaParaAtualizarPeso = `https://ifsp.ddns.net/webservices/imc/pessoa/${idPessoa}`;
        fetch(urlComIdDaPessoaParaAtualizarPeso, options).then(
            (respostaDoServidor) => {
                if (respostaDoServidor.ok) {
                    console.log("Código de resposta: " + respostaDoServidor.status);
                    return respostaDoServidor.json();
                } else {
                    alert(`Erro. Peso não atualizado. Código de resposta: ${respostaDoServidor.status}`);
                }
            }
        ).then((pessoa) => {

            let novoPeso = Object.values(pessoa)[3];

            pesoPessoa.innerHTML = novoPeso;

            let novoImc = Object.values(pessoa)[4];

            let imcPessoa = botaoDiminuirPeso.parentElement.parentElement.children[4];
            imcPessoa.innerHTML = novoImc;

            let novoStatus = Object.values(pessoa)[5];
            let statusPessoa = botaoDiminuirPeso.parentElement.parentElement.children[5];
            statusPessoa.innerHTML = novoStatus;

            alert("Peso atualizado com sucesso!");

        })

    }

}


function excluirLinha(e) {

    let botao = e.target;
    let idPessoa = botao.parentElement.parentElement.children[0].innerText;

    let options = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        }
    }

    let urlPessoaAserDeletada = `https://ifsp.ddns.net/webservices/imc/pessoa/${idPessoa}`;
    fetch(urlPessoaAserDeletada, options).then(
        (respostaDoServidor) => {
            if (respostaDoServidor.ok) {
                console.log("Código de resposta: " + respostaDoServidor.status);
                return respostaDoServidor.json();
            } else {
                console.log("Código de resposta: " + respostaDoServidor.status);
                alert("Erro. Pessoa não removida.");
            }
        }).then((msg) => {
            alert(Object.values(msg)[0]);
            botao.parentElement.parentElement.remove();
        });
}


function removerMaiorImc(e) {

    fetch("https://ifsp.ddns.net/webservices/imc/pessoa").then(
        (respostaDoServidor) => {

            if (respostaDoServidor.ok) {
                console.log("Código de resposta: " + respostaDoServidor.status);
                return respostaDoServidor.json();
            } else {
                console.log("Código de resposta: " + respostaDoServidor.status);
            }

        }).then(
            (listaDePessoasCadastradas) => {

                if (listaDePessoasCadastradas.length === 0) {
                    alert("Nenhuma pessoa cadastrada. Processo de remoção não realizado.");
                } else {
                    let qtdePessoasCadastradas = listaDePessoasCadastradas.length;
                    let maiorImc = Object.values(listaDePessoasCadastradas[0])[4];
                    let indicePessoaComMaiorImc = Object.values(listaDePessoasCadastradas[0])[0];

                    for (indicePessoa = 1; indicePessoa < qtdePessoasCadastradas; indicePessoa++) {
                        if (listaDePessoasCadastradas[indicePessoa].imc > maiorImc) {
                            maiorImc = listaDePessoasCadastradas[indicePessoa].imc;
                            indicePessoaComMaiorImc = listaDePessoasCadastradas[indicePessoa].id;
                        }
                    }

                    return indicePessoaComMaiorImc;

                }

            }).then(
                (id) => {

                    if (id !== undefined) {
                        let options = {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json"
                            }
                        }
    
                        let urlPessoaAserDeletada = `https://ifsp.ddns.net/webservices/imc/pessoa/${id}`;
                        fetch(urlPessoaAserDeletada, options).then(
                            (respostaDoServidor) => {
                                if (respostaDoServidor.ok) {
                                    console.log("Código de resposta: " + respostaDoServidor.status);
                                    return respostaDoServidor.json();
                                } else {
                                    console.log("Código de resposta: " + respostaDoServidor.status);
                                    alert("Erro. Pessoa não removida.");
                                }
                            }).then((msg) => {
                                alert(Object.values(msg)[0]);
    
                                let linhasTabela = document.querySelectorAll(".tupla");
    
                                for (linha of linhasTabela) {
                                    let idDaPessoa = linha.children[0].innerText;
                                    if (parseInt(idDaPessoa) === id) {
                                        linha.remove();
                                    }
                                }
    
                            });
                    }

                }
            )
}


function removerMenorImc(e) {
    fetch("https://ifsp.ddns.net/webservices/imc/pessoa").then(
        (respostaDoServidor) => {

            if (respostaDoServidor.ok) {
                console.log("Código de resposta: " + respostaDoServidor.status);
                return respostaDoServidor.json();
            } else {
                console.log("Código de resposta: " + respostaDoServidor.status);
            }

        }).then(
            (listaDePessoasCadastradas) => {

                if (listaDePessoasCadastradas.length === 0) {
                    alert("Nenhuma pessoa cadastrada. Processo de remoção não realizado.");
                } else {
                    let qtdePessoasCadastradas = listaDePessoasCadastradas.length;
                    let menorImc = Object.values(listaDePessoasCadastradas[0])[4];
                    let indicePessoaComMenorImc = Object.values(listaDePessoasCadastradas[0])[0];

                    for (indicePessoa = 1; indicePessoa < qtdePessoasCadastradas; indicePessoa++) {
                        if (listaDePessoasCadastradas[indicePessoa].imc < menorImc) {
                            menorImc = listaDePessoasCadastradas[indicePessoa].imc;
                            indicePessoaComMenorImc = listaDePessoasCadastradas[indicePessoa].id;
                        }
                    }

                    return indicePessoaComMenorImc;

                }

            }).then(
                (id) => {

                    if (id !== undefined) {
                        
                        let options = {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json"
                            }
                        }
    
                        let urlPessoaAserDeletada = `https://ifsp.ddns.net/webservices/imc/pessoa/${id}`;
                        fetch(urlPessoaAserDeletada, options).then(
                            (respostaDoServidor) => {
                                if (respostaDoServidor.ok) {
                                    console.log("Código de resposta: " + respostaDoServidor.status);
                                    return respostaDoServidor.json();
                                } else {
                                    console.log("Código de resposta: " + respostaDoServidor.status);
                                    alert("Erro. Pessoa não removida.");
                                }
                            }).then((msg) => {
                                alert(Object.values(msg)[0]);
    
                                let linhasTabela = document.querySelectorAll(".tupla");
    
                                for (linha of linhasTabela) {
                                    let idDaPessoa = linha.children[0].innerText;
                                    if (parseInt(idDaPessoa) === id) {
                                        linha.remove();
                                    }
                                }
    
                            });
                    }

                }
            )
}

fetch("https://ifsp.ddns.net/webservices/imc/pessoa").then(
    (respostaDoServidor) => {

        if (respostaDoServidor.ok) {
            console.log("Código de resposta: " + respostaDoServidor.status);
            return respostaDoServidor.json();
        } else {
            console.log("Código de resposta: " + respostaDoServidor.status);
        }

    }).then(
        (listaDePessoasCadastradas) => {

            let tbody = document.querySelector("#tabela tbody");

            for (pessoa of listaDePessoasCadastradas) {

                let linhaTabela = document.createElement("tr");
                linhaTabela.classList.add("tupla");
                let qtdeAtributosDaPessoa = Object.keys(pessoa).length;

                for (let indiceDoAtributo = 0; indiceDoAtributo < qtdeAtributosDaPessoa; indiceDoAtributo++) {

                    let celulaDaLinha = document.createElement("td");
                    celulaDaLinha.innerText = Object.values(pessoa)[indiceDoAtributo];
                    linhaTabela.append(celulaDaLinha);

                }

                let celulaDaLinha = document.createElement("td");
                bExcluir = document.createElement("button");
                bExcluir.innerText = "Excluir";
                bExcluir.classList.add("excluir");
                bExcluir.addEventListener("click", excluirLinha);

                bAumentarPeso = document.createElement("button");
                bAumentarPeso.innerText = "+ Peso";
                bAumentarPeso.classList.add("acrescPeso");
                bAumentarPeso.addEventListener("click", acrescentarPeso);

                bDiminuirPeso = document.createElement("button");
                bDiminuirPeso.innerText = "- Peso";
                bDiminuirPeso.classList.add("diminPeso");
                bDiminuirPeso.addEventListener("click", diminuirPeso);

                celulaDaLinha.append(bExcluir);
                celulaDaLinha.append(bAumentarPeso);
                celulaDaLinha.append(bDiminuirPeso);

                linhaTabela.append(celulaDaLinha);

                tbody.append(linhaTabela);
            }
        }
    );

let botaoEnviar = document.querySelector("#enviar");
botaoEnviar.addEventListener("click", adicionarLinha);

let BotaoRemoverMaiorImc = document.querySelector("#removerMaiorImc");
BotaoRemoverMaiorImc.addEventListener("click", removerMaiorImc);

let BotaoRemoverMenorImc = document.querySelector("#removerMenorImc");
BotaoRemoverMenorImc.addEventListener("click", removerMenorImc);