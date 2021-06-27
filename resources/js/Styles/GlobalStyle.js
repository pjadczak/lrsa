import styled , { createGlobalStyle } from 'styled-components';
import imgBgWithoutLogin from '../assets/images/wallpapers/pexels-pixabay-60006.jpg';
import loadingImage from '../assets/images/loading2.gif';
import { mobileWidth } from '../actions/variables';

export const GlobalStyle = createGlobalStyle`

    :root{

        --leftPanelBg: #3c4b64;
        --lightTextColor: #a7a7a7;
        --colorGreyLight: #e8e8e8;
        --colorWhiteLight: #fbfbfb;
    }

    .rs-btn , .rs-input , .rs-picker-input{
        border-radius: 0px;
    }

    @keyframes widthGrow{
        0% { width: 0 }
        100% { width: 100% }
    }

    html{
        padding: 0px;
        margin: 0px;
        height: 100%;
    }

    *{
        font-family: 'Roboto','Nunito';
    }

    body{
        font-size: 14px;
        padding: 0px;
        margin: 0px;
        height: 100%;
        background: url(${props => !props.isLogged ? imgBgWithoutLogin : ''}) no-repeat top left;
        background-size: cover;
        font-smooth: antialiased;
        @media (max-width: 650px){
            background-position: right;
        }
        .rs-picker-menu{
            z-index: 1020;
        }
        .logoStart{
            max-width: 450px;
            position: absolute;
            top: 50px;
            left: 50px;
            img{
                max-width: 100%;
            }
        }
        .rs-picker-menu{
            .footer{
                background-color: #f7f7f7;
                padding: 5px;
                hr{
                    margin-bottom: 5px;
                    margin-top: 0px;
                }
                a.addItem{
                    display: block;
                    padding: 5px 15px 5px 15px;
                    color: #b7b6b6;
                    &:hover{
                        color: black;
                    }
                }
            }
        }
        &.showMenuMobile {
            .menuBlock{
                right: 0px;
            }
            #responsiveMenuBackground{
                display: block;
                animation: showBackgroundResposiveMenu 0.4s normal forwards ease-out;
            }
            .mainBlock{
                padding-top: 0px;
            }
        }
        @media (max-width: 620px){
            .rs-modal-sm{
                width: calc(100% - 20px);
            }
        }
        #root{
            height: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .loadingLayer{
                &:after{
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100%;
                    height: 100%;
                    z-index: 300;
                    background-color: rgba(255,255,255,0.6);
                }
                &:before{
                    content: '';
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -32px;
                    margin-top: -32px;
                    width: 64px;
                    height: 64px;
                    z-index: 301;
                    background-image: url(${loadingImage});
                }
            }
        }
        &.shortLeftBar{
            .leftPanel{
                width: 50px;
                max-width: 50px;
                label{
                    opacity: 0;
                }
                .bottom a::before{
                    transform: rotate(180deg);
                }
                .logo{
                    padding: 5px;
                    .logo_full{
                        opacity: 0;
                        top: -50px;
                    }
                    .logo_short{
                        opacity: 1;
                    }
                }
            }
            .rightPanel{
                margin-left: 50px;
            }
        }
        .rs-pagination{
            display: block;
            text-align: right;
            margin: 10px 0px;
            li{
                display: inline-block;
            }
        }
        table.tableList{
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
            td{
                padding: 8px;
                &.actions{
                    /* max-width: 135px; */
                    button.rs-btn{
                        margin-right: 2px;
                    }
                }
            }
            tbody{
                background-color: white;
                tr{
                    td{
                        border-left: 1px solid var(--colorGreyLight);
                        border-right: 1px solid var(--colorGreyLight);
                        border-bottom: 1px solid var(--colorGreyLight);
                    }
                    &:hover{
                        td{
                            background-color: #d4e1f7;
                        }
                    }
                }
            }
            thead{
                max-height: 80px;
                background-color: black;
                tr td{ color: white; }
            }
            tr{
                td{
                    &.actions-buttons-3{
                        width: 85px;
                    }
                    &.actions-buttons-2{
                        width: 95px;
                    }
                    &.actions-buttons-1{
                        width: 38px;
                    }
                    &.actions{
                        .rs-btn.btn-edit{
                            &:hover{
                                background-color: var(--leftPanelBg);
                                color: white;
                            }
                        }
                    }
                    &.td-label-id{
                        width: 40px;
                    }
                    &.td-label-photo{
                        padding: 2px 8px 2px 8px;
                        width: 60px;
                        img{
                            max-height: 40px;
                        }
                    }
                    .log{
                        span:nth-child(1){
                            color: green;
                        }
                    }
                }
                &.disabled{
                    background-color: #d2d2d2;
                    &:hover td{
                        background-color: #d2d2d2;
                        color: black;
                    }
                }
            }
        }
    }
    .rs-picker-menu{
        z-index: 1000;
    }

    .sun-editor{
        .se-container{
            display: flex;
            flex-direction: column;
            .se-wrapper{
                flex: 1;
                display: flex;
                .se-wrapper-inner{
                    flex: 1;
                    height: unset !important;
                    /* max-height: 100%; */
                }
            }
        }
    }


`;