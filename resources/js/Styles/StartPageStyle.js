import styled from 'styled-components';

export const BoxLogin = styled.div`
    /* flex: 1; */
    width: 500px;
    box-sizing: border-box;
    position: absolute;
    bottom: 25%;
    right: 15%;
    border: 1px solid white;
    box-shadow: 0px 10px 50px rgba(0,0,0,0.6);

    @media (max-height: 750px) {
        bottom: 50px;
    }

    @media (max-width: 650px) {
        /* position: relative; */
        bottom: 20px;
        left: auto;
        right: auto;
        width: calc(100% - 40px);
        margin: 20px 0 0 0px;
    }

    .boxSuccess{
        padding: 30px;
        background-color: white;
        color: green;
        text-align: center;
        strong{
            font-size: 24px;
        }
        header{
            background-color: black;
            padding: 10px 20px;
            color: white;
            margin-top: -30px;
            margin-left: -30px;
            margin-right: -30px;
            margin-bottom: 20px;
            text-align: center;
        }
    }

    .tab{
        background-color: black;
        ul{
            display: flex;
            /* flex-direction: row; */
            list-style: none;
            margin: 0px;
            padding: 0px;
            li{
                flex: 1;
                padding: 0px;
                margin: 0px;
                a{
                    flex: 1;
                    display: block;
                    padding: 10px 15px;
                    color: #757575;
                    overflow: hidden;
                    &.selected{
                        background-color: #4a4a4a;
                        border: 1px solid black;
                        color: white;
                    }
                    &:hover{
                        text-decoration: none;
                    }
                }
            }
        }
    }
    .box{
        padding: 20px;
        border: 1px solid #DFDFDF;
        background-color: #F7F7F7;
        padding-top: 40px;
        transition: all .3s;
        &.box-register{
            padding-top: 20px;
            .box-top{
                margin: -20px -20px 0px -20px;
                padding: 20px 20px 0px 20px;
            }
            &.box-organizer{
                .box-top{
                    padding-bottom: 20px;
                    background-color: var(--colorAwarded);
                    margin-bottom: 20px;
                }
            }
        }
        &.box-lone{
            padding-top: 20px;
        }
        &.box-organizer{
            .toggle-user-type{
                background-color: var(--colorAwarded) !important;
            }
        }
        label{
            display: block;
            text-align: center;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        header{
            background-color: black;
            padding: 10px 20px;
            color: white;
            margin-top: -20px;
            margin-left: -20px;
            margin-right: -20px;
            text-align: center;
        }
        .content{
            min-height: 10px;
            padding: 20px;
            text-align: center;
            &.content-ok{
                color: green;
            }
            &.content-error{
                color: red;
            }
        }
        .rowBox{
            text-align: right;
            &.rowError input{
                border-color: red;
                background-color: #ffe2e2;
            }
            input[type=text]{
                transition: all .3s;
            }
            .colLabelInput{
                padding-top: 9px;
            }
        }
        .rowBoxMargin{
            margin-bottom: 10px;
        }
        .rowBoxSwitch{
            margin: 20px 0px 20px 0px;
            .mdLeft{
                text-align: left;
                padding-top: 5px;
            }
        }
        .rowBoxRodo{
            .rs-btn-toggle{
                transition: all 0.3s;
                &:after{
                    background-color: black;
                }
            }
            &.error{
                .mdLeft{
                    color: red;
                }
                .rs-btn-toggle{
                    background-color: red;
                    &:after{
                        background-color: white;
                    }
                }
            }
        }
        .rowButtons{
            display: flex;
            flex-direction: row;
            justify-content: flex-end; 
            padding-right: 5px;
            position: relative;
            .button{
                flex: 1,
            }
            a.forget{
                position: absolute;
                top: 5px;
                left: 5px;
            }
            .button-back{
                position: absolute;
                top: 0px;
                left: 5px;
            }
        }
        .button-facebok{
            background-color: #3b5998;
            color: white;
            &:hover{
                background-color: #2A4379;
            }
        }
        .button-google{
            background-color: #DB4437;
            color: white;
            &:hover{
                background-color: #AB2D23;
            }
        }
        .socials{
            @media (max-width: 992px){
                .rs-col{
                    width: 50%;
                    float: left;
                }
            }
            button{
                font-size: 16px;
                font-weight: 300;
                text-transform: none;
                padding: 8px 12px;
                border: 0px;
                &:focus{
                    outline: 0px;
                }
                &.google{
                    div{
                        padding: 8px 0px 7px 10px !important;
                    }
                    span{
                        padding: 8px 10px 7px 0px !important;
                    }
                }
            }
        }
    }
`;