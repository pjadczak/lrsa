import styled from 'styled-components';

const TopPanelStyled = styled.div`
    display: flex;
    flex-direction: row;
    padding: 15px;
    border-bottom: 1px solid var(--colorGreyLight);
    max-height: 50px;
    flex: 1;
    .left{
        flex: 1;
        ul{
            display: block;
            list-style: none;
            margin: 0px;
            padding: 0px 0px 0px 57px;
            position: relative;
            li{
                display: inline-block;
                padding: 0px;
                position: relative;
                a{
                    color: var(--lightTextColor);
                    font-size: 1em;
                    padding: 0px 10px 0px 10px;
                    text-decoration: none;
                    &:hover{
                        color: black;
                    }
                }
                &.hamburger{
                    position: absolute;
                    top: -7px;
                    left: 20px;
                    a{
                        padding: 0px 10px 0px 0px;
                        font-size: 1.5em;
                        position: relative;
                        top: 2px;
                        .rs-icon{
                            font-size: inherit;
                        }
                    }
                }
            }
        }
    }
    .right{
        ul{
            display: block;
            list-style: none;
            margin: 0px;
            padding: 0px 0px 0px 57px;
            position: relative;
            li{
                display: inline-block;
                padding: 0px;
                position: relative;
                font-size: 14px;
                .content{
                    display: block;
                    *{
                        font-size: 12px !important;
                        font-style: italic;
                        color: #adadad;
                    }
                }
                span.date{
                    font-size: inherit;
                    display: inline-block;
                    margin-right: 10px;
                }
                .more{
                    background-color: #3498ff;
                    border-top: 1px solid #eaeaea;
                    a{
                        padding: 2px 10px;
                        display: block !important;
                        text-align: right;
                        color: white;
                    }
                }
                a{
                    color: var(--lightTextColor);
                    padding: 0px 10px 0px 10px;
                    text-decoration: none;
                    &:hover{
                        color: black;
                    }
                    .rs-icon{
                        font-size: 1.3em;
                    }
                    .rs-badge-content{
                        font-size: 0.7em;
                    }
                }
                .layerMoreInfo{
                    display: none;
                    position: absolute;
                    top: 24px;
                    right: 0px;
                    z-index: 100;
                    min-width: 250px;
                    max-width: 300px;
                    background-color: white;
                    border: 1px solid var(--colorGreyLight);
                    &.showLayer{
                        display: block;
                    }
                    .noRecords{
                        padding: 10px 20px;
                        font-style: italic;
                        color: grey;
                    }
                    .info{
                        margin: 2px 2px 0px 2px;
                        background-color: #f5f5f5;
                        padding: 10px;
                        color: #9c9c9c;
                        text-align: center;
                        white-space: nowrap;
                        .lastLogin{
                            font-size: 0.8em;
                            span{
                                color: black;
                            }
                        }
                        header{
                            font-size: 1em;
                            color: green;
                            margin-bottom: 10px;
                            .role{
                                font-size: 0.6em;
                                color: grey;
                                &.role-root{
                                    color: red;
                                }
                            }
                            .photo{
                                margin: 20px auto;
                                width: 150px;
                                height: 150px;
                                border-radius: 150px;
                                overflow: hidden;
                                text-align: center;
                                img{
                                    min-width: 100%;
                                    min-height: 100%;
                                    max-height: 100%;
                                }
                            }
                        }
                    }
                    ul{
                        padding: 0px;
                        li{
                            display: block;
                            a{
                                display: block;
                                padding: 10px 15px;
                                margin: 2px 2px 2px 2px;
                                border-top: 1px solid var(--colorGreyLight);
                                &:hover{
                                    background-color: var(--colorGreyLight);
                                }
                                .rs-icon{
                                    position: relative;
                                    font-size: 0.8em;
                                    margin-right: 10px;
                                    top: -1px;
                                }
                                &.logout{
                                    .rs-icon{
                                        color: red;
                                    }
                                }
                            }
                            &:first-child a{
                                border-top: 0px;
                            }
                        }
                    }
                    &.list{
                        padding: 1px;
                        label{
                            background-color: black;
                            color: white;
                            padding: 3px 10px;
                            margin: 0px;
                            text-align: center;
                            display: block;
                        }
                        ul{
                            min-width: 200px;
                            *{
                                font-family: Nunito;
                                font-size: 0.9em;
                            }
                            li{
                                padding: 5px 10px;
                                white-space: nowrap;
                                color: grey;
                                font-family: roboto;
                                &:nth-child(odd){
                                    background-color: #f7f7f7;
                                }
                            }
                        }
                        .more{
                            padding: 3px 5px 5px 5px;
                            text-align: right;
                            font-size: 0.9em;
                            font-family: Nunito;
                            a{
                                position: relative;
                                display: inline-block;
                                i{
                                    display: inline-block;
                                    position: relative;
                                    top: 1px;
                                    left: 3px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

`;	

export default TopPanelStyled;