import styled from 'styled-components';

const LeftPanelStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .logo{
        padding: 20px;
        text-align: center;
        background-color: rgba(0,0,21,.2);
        height: 103px;
        overflow: hidden;
        img{
            max-width: 100%;
            width: 100%;
            transition: all 0.8s;
            position: relative;
            top: 0px;
            &.logo_short{
                opacity: 0;
            }
            &.logo_full{
                top: -10px;
            }
        }
    }
    .content{
        label{
            display: block;
            padding: 10px 15px;
            color: grey;
            transition: all 0.3s;
        }
        ul{
            display: block;
            list-style: none;
            padding: 0px;
            margin: 0px;
            li{
                padding: 0px;
                margin: 0px;
                a{
                    display: flex;
                    padding: 10px 15px;
                    text-decoration: none;
                    color: white;
                    transition: all 0.3s;
                    .rs-icon{
                        width: 21px;
                        position: relative;
                        font-size: 18px;
                        color: #888888;
                        text-align: center;
                        margin-right: 22px;
                    }
                    &:hover{
                        background-color: #202b3c;
                    }
                }
                &.hasMenu{
                    a:first-child{
                        position: relative;
                        &:after{
                            content: '\f061';
                            display: block;
                            position: absolute;
                            top: 12px;
                            right: 20px;
                            font-family: 'rsuite-icon-font' !important;
                            transition: all 0.3s;
                            font-size: 10px;
                            color: grey;
                        }
                    }
                    ul{
                        height: 0px;
                        overflow: hidden;
                        transition: all 0.3s;
                        li a{
                            padding-left: 57px;
                            &:after{
                                display: none !important;
                            }
                        }
                    }
                }
                &.showSubmenu{
                    a:first-child{
                        &:after{
                            transform: rotate(90deg);
                            color: white;
                        }
                    }
                    ul{
                        height: auto;
                        overflow: auto;
                    }
                }
                &.active {
                    a{
                        background-color: #4f6282;
                    }
                }
            }
        }
        .dashboard{
            ul li a{
                background-color: hsla(0,0%,100%,.05);
                &:hover{
                    background-color: rgba(0,0,0,.4);
                }
            }
        }
    }
    .bottom{
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        a{
            display: block;
            color: var(--leftPanelBg);
            background-color: rgba(0,0,21,.2);
            text-align: right;
            padding: 10px 20px 10px 0px;
            transition: all 0.3s;
            text-decoration: none;
            &:before{
                transition: all 0.3s;
                display: inline-block;
                content: '\f060';
                font-family: 'rsuite-icon-font';
            }
            &:hover{
                color: white;
                background-color: rgba(0,0,21,.5);
            }
        }
    }
`;	

export default LeftPanelStyle;