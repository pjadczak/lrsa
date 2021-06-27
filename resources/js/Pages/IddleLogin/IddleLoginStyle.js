import styled from 'styled-components';

const IddleLoginStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    position: fixed;
    bottom: -100%;
    left: 0px;
    background-color: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1010;
    transition: all 0.34s;
    animation: splash 0.4s normal forwards ease-in-out;
    @keyframes splash {
        from { bottom: -100%; }
        to { bottom: 0px; }
    }
    .box{
        min-width: 400px;
        width: 50%;
        min-height: 300px;
        border: 1px solid grey;
        background-color: #f1f1f1;
        padding: 1px;
        position: relative;
        header{
            background-color: black;
            text-align: center;
            color: white;
            padding: 10px 20px;
        }
        .rs-row{
            margin: 30px 25px 25px 25px;
            .rs-col{
                label{
                    text-align: center;
                    display: block;
                    color: grey;
                    margin-bottom: 20px;
                    font-size: 18px;
                    span{
                        display: block;
                        font-size: 12px;
                        color: #afafaf;
                    }
                }
                .photo{
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    margin: 0px auto;
                    border-radius: 180px;
                    margin-bottom: 15px;
                    img{
                        height: 100%;
                    }
                }
                .buttons{
                    margin-top: 25px;
                    display: block;
                    text-align: right;
                    .logout{
                        background-color: black;
                        color: white;
                        float: left;
                        &:hover{
                            background-color: grey;
                        }
                    }
                }
            }
        }
    }
`;	

export default IddleLoginStyle;