import { json, Router } from "express";
import { connection } from "./conexao.js";
import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken"

const router = Router()
const segredo = 'KEYJWT45KZY';

router.post('/login', (req, resp) => {
    const { EmailInputValue, SenhaInputValue } = req.body

    if (!EmailInputValue || !SenhaInputValue) {
        return resp.status(400).json({
            Mensagem: "Email e senha são campos obrigatórios"
        })
    } else {
        connection.query(
            "SELECT * FROM usuarios WHERE email=(?)", [EmailInputValue],
            (err, resultado) => {
                if (err) {
                    resp.json({
                        Mensagem: "Houve um error ao realizar a requisição.",
                        error: err.message
                    })
                } else {
                    if (resultado.length > 0) {
                        bcrypt.compare(SenhaInputValue, resultado[0].senha, (err, ResultadoCompareSenhaHash) => {
                            if (err) {
                                return resp.status(500).json({
                                    Mensagem: "Error ao comparar senha"
                                })
                            }
                            if (ResultadoCompareSenhaHash) {

                                
                                const payload = {
                                    id: resultado[0].id_usuario,
                                    nome: resultado[0].nome,
                                    role: resultado[0].role
                                };

                                const token = jwt.sign(payload, segredo, { expiresIn: '1h' })

                                resp.json({
                                    Verifica_Email_Existe: true,
                                    Verifica_Senha_Correta: true,
                                    Mensagem1: "Email Encontrado",
                                    Mensagem2: "Senha correta",
                                    Mensagem3: "Login realizado com sucesso! Redirecionando...",
                                    Token:      token,
                                    dados: { id_usuarios: resultado[0].id_usuario, nome: resultado[0].nome, email: resultado[0].email, senha: resultado[0].senha , role: resultado[0].role}

                                })
                            } else {
                                resp.json({
                                    Verifica_Email_Existe: true,
                                    Verifica_Senha_Correta: false,
                                    Mensagem1: "Email Encontrado",
                                    Mensagem2: "Senha errada",
                                    Mensagem3: `Senha inserida: ${SenhaInputValue}`,
                                    ResultadoCompareSenhaHash: ResultadoCompareSenhaHash
                                })
                            }

                        })



                    } else {
                        resp.json({
                            Verifica_Email_Existe: false,
                            Mensagem: "Email não encontrado"
                        })
                    }

                }
            }
        )
    }


})

router.post('/registro', (req, resp) => {
    const { NomeInputValue, EmailInputValue, SenhaInputValue01, SenhaInputValue02 } = req.body

    if (!NomeInputValue || !EmailInputValue || !SenhaInputValue01 || !SenhaInputValue02) {
        return resp.json({
            Verifica_Campos_Preenchido: false,
            Mensagem: "Campos obrigatorios estão vazios"
        })
    } else {

        if (SenhaInputValue01 != SenhaInputValue02) {
            return resp.json({
                Verifica_Campos_Preenchido: true,
                Verifica_Senhas_Iguais: false,
                Mensagem: "As senhas precisam ser iguais."
            })
        } else {

            let SenhaInputValue = SenhaInputValue01
            connection.query(
                "SELECT * FROM usuarios WHERE email=(?)", [EmailInputValue],
                (err, resultado) => {
                    if (err) {
                        resp.status(400).json({
                            Mensagem: "Houve um error ao realizar a requisição.",
                        })
                    }

                    else {

                        if (resultado.length > 0) {
                            resp.json({
                                Verifica_Campos_Preenchido: true,
                                Verifica_Senhas_Iguais: true,
                                Ja_Existe_Email_Cadastrado: true,
                                Mensagem: "Email já está cadastrado"
                            })
                        } else {
                            bcrypt.hash(SenhaInputValue, 10, (err, hash) => {
                                if (err) {
                                    console.log('Erro ao criar o hash da senha:', err);
                                    return;
                                } else {
                                    console.log('Senha usando Hash')
                                    console.log(hash)

                                    connection.query(
                                        "INSERT INTO usuarios (nome, email, senha, role) VALUES (?,?,?,?)", [NomeInputValue, EmailInputValue, hash, "user"], (err, resultado2) => {
                                            if (err) {
                                                return resp.status(500).json({
                                                    Mensagem: 'Erro ao cadastrar usuário',
                                                    error: err
                                                });
                                            } else {
                                                resp.json({
                                                    Verifica_Campos_Preenchido: true,
                                                    Verifica_Senhas_Iguais: true,
                                                    Mensagem: `Registro bem-sucedido. Redirecionando...`
                                                })
                                            }
                                        }



                                    )
                                }

                            });
                        }
                    }
                }
            )


        }
    }









})

router.post("/authToken", (req, resp) => {
    const { token } = req.body

    if (!token){
        return resp.json({
            TemToken: false,
            Mensagem: "Token não fornecido"
        })
    }

    try {
        // Verifica a validade do token com a chave secreta
        const verificaToken = jwt.verify(token, segredo);

        // Retorna os dados do token se for válido
        resp.json({
            TemToken: true,
            TokenValidade: true,
            Mensagem: 'Token valido',
            tokenDados: verificaToken
        });
    } catch (error) {
        // Se o token for inválido ou expirado
        resp.status(401).json({
            TemToken: false,
            TokenValidade: false,
            Mensagem: 'Token inválido ou expirado'
        });
    }
    
})

router.post("/infosUser", ( req, resp) => {
    const { id } = req.body

    connection.query(
        "SELECT * FROM usuarios WHERE id_usuario=(?)", [id],

        (err, resultado) => {
            if(err){
                resp.json({
                    Mensagem: "Error"
                })
            }
            else{
                resp.json({
                    resultado: resultado[0]
                })
            }
        }
    )
})
export default router