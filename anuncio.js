import { json, response, Router } from "express";
import { connection } from "./conexao.js";


import jwt from "jsonwebtoken"

const router = Router()

router.get("/listDisponivel", (req, resp) => {
    const { mainTag } = req.body
    let sqlQuery = "SELECT * FROM anuncios WHERE disponibilidade=(?)"
    let parametro = [true]

    if (mainTag) {
        sqlQuery += " AND mainTag=(?)"
        parametro.push(mainTag)
    }

    connection.query(
        sqlQuery, parametro,

        (err, resultado) => {
            if (err) {
                resp.json({
                    Mensagem1: "Error ao realizar consulta"
                })
            } else {
                resp.json({
                    Mensagem1: `Exibindo todos os resultados de anuncios ativos e com tags ${parametro}`,
                    resultado: resultado
                })

            }
        }
    )


})

router.post("/anuncioInfo", (req, resp) => {
    const { CodigoProduto } = req.body

    connection.query(
        "SELECT * FROM anuncios WHERE id=(?)", [CodigoProduto],

        (err, resultado) => {

            if (err) {
                resp.json({
                    Mensagem1: "Error ao realizar consulta"
                })
            } else {
                resp.json({
                    Mensagem1: `Sucesso ao realizar consulta de anuncio com id ${CodigoProduto}`,
                    Dados: resultado
                })
            }

        }
    )
})


router.post("/pagamento", (req, resp) => {
    const { MetodoPayoutSelecionado, IdUsuario, idAnuncio, QuantHoras } = req.body
    let PermicaoPagamento = false

    if (MetodoPayoutSelecionado === "Coins") {
    
        let UsuarioEncontrado = false
        let AnuncioEncontrado = false
        let TemCoins = false
        let AnuncioDisponibulidade = false
        PermicaoPagamento = true
        


        connection.query(
            "SELECT * FROM usuarios Where id_usuario =(?)", [IdUsuario], (err, resultado) => {
                if (err) {
                    resp.json({
                        Mensagem1: "Error ao Fazer Requisição"
                    })
                } else { 
                    if (resultado.length > 0) { //Usuario encontrado

                        UsuarioEncontrado = true
                        let UsuarioDados = []
                        UsuarioDados.push(resultado[0].nome)
                        UsuarioDados.push(resultado[0].HCoins)

                        connection.query(
                            "SELECT * FROM anuncios Where id =(?)", [idAnuncio], (err, resultado) => {
                                if (err) {
                                    resp.json({
                                        Mensagem1: "Error ao Fazer Requisição"
                                    })
                                } else {

                                    if (resultado.length > 0) { // Verifica se o anuncio existe

                                        AnuncioEncontrado = true
                                        let AnuncioDados = []
                                        AnuncioDados.push(resultado[0].id)
                                        AnuncioDados.push(resultado[0].nome)
                                        AnuncioDados.push(resultado[0].preco_por_hora)
                                        AnuncioDados.push(resultado[0].disponibilidade)

                                        console.log(UsuarioDados)
                                        console.log(AnuncioDados)

                                        if (UsuarioDados[1] >= (AnuncioDados[2] * QuantHoras)) { // Verifica se usuario tem HCoins maior que O valor final
                                            TemCoins = true
                                            let ContaFinal = UsuarioDados[1] - (AnuncioDados[2] * QuantHoras)

                                            if (resultado[0].disponibilidade === 1) { // Verifica se está dispoonivel se sim continua
                                                AnuncioDisponibulidade = true
                                                connection.query(
                                                    "UPDATE usuarios SET HCoins =(?) WHERE id_usuario =(?)", [ContaFinal, IdUsuario], (err, resultado) => {

                                                        if (err) {
                                                            resp.json({
                                                                Mensagem1: "Falha ao tentar dar UPDATE no HCoins"
                                                            })
                                                        } else {

                                                            connection.query(
                                                                "UPDATE anuncios SET disponibilidade =(?) WHERE id =(?)", [0, idAnuncio], (err, resultado) => {
                                                                    if (err) {
                                                                        resp.json({
                                                                            Mensagem1: "Falha ao tentar dar UPDATE na Disponibilidade do anuncio"
                                                                        })
                                                                    } else {
                                                                        resp.json({ // Final Bem Sucedido
                                                                            PermicaoPagamento : PermicaoPagamento,
                                                                            UsuarioEncontrado: UsuarioEncontrado,
                                                                            AnuncioEncontrado: AnuncioEncontrado,
                                                                            AnuncioDisponibulidade: AnuncioDisponibulidade,
                                                                            TemCoins: TemCoins,
                                                                            Mensagem1: "Transação concluida com sucesso. Redirecionando",
                                                                            Mensagem2: `Você possuia ${UsuarioDados[1]}. Pagou ${AnuncioDados[2] * QuantHoras} e ficou com ${ContaFinal}`
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    }
                                                )
                                            } else {
                                                resp.json({
                                                    AnuncioDisponibulidade: AnuncioDisponibulidade,
                                                    Mensagem1: "Anuncio já está reservado"
                                                })
                                            }




                                        } else { // Se não possuir
                                            resp.json({
                                                TemCoins: TemCoins,
                                                Mensagem1: "Você não possui HCOINS o suficiente"
                                            })
                                        }

                                    } else {
                                        resp.json({
                                            AnuncioEncontrado: AnuncioEncontrado,
                                            Mensagem1: "Produto não encontrado"
                                        })
                                    }

                                }
                            }
                        )




                    } else { // Usuario não encontrado pela Id fornecida
                        resp.json({
                            UsuarioEncontrado: UsuarioEncontrado,
                            Mensagem1: `Usuario com id (${IdUsuario} não foi encontrado)`
                        })
                    }
                }
            }


        )
    }else if (MetodoPayoutSelecionado === "Pix"){
        resp.json({
            PermicaoPagamento: PermicaoPagamento,
            Mensagem1: "Operação com Pix não disponivel"
        })
    }else{
        resp.json({
            PermicaoPagamento: PermicaoPagamento,
            Mensagem1: "Invalido Tipo de Pagamento",
            TipoPagamento: MetodoPayoutSelecionado
        })
    }


})

export default router

/* 

resp.json({
                                        Mensagem1: `Usuario com id (${IdUsuario}) encontrado`,
                                        Mensagem2: `Anuncio com id (${idAnuncio}) encontrado`,
                                        UsuarioEncontrado: UsuarioEncontrado,
                                        UsuarioDados: UsuarioDados,
                                        resultado: AnuncioDados


                                    })


                                    resp.json({
                                                        Mensagem1: "Update bem sucedido",
                                                        Mensagem2: `Você possuia ${UsuarioDados[1]}. Pagou ${AnuncioDados[2]} e ficou com ${ContaFinal}`
                                                    })
*/