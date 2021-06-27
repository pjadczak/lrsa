import styled from 'styled-components';


const TopPanelStatusStyle = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    max-height: 50px;
    height: 50px;
    border-bottom: 1px solid var(--colorGreyLight);
    padding-left: 16px;
    justify-content: right;
    max-height: 50px;
    flex: 1;
    position: relative;
    &.loading{
        &:after{
            content: '';
            height: 1px;
            background-color: red;
            width: 100%;
            position: absolute;
            bottom: 0px;
            left: 0px;
            animation-name: widthGrow;
            animation-duration: 4s;
        }
    }
    .Main-Breadcrumb{
        display: flex;
        flex: 1;
        align-items: center;
        ul{
            list-style: none;
            margin: 0px;
            padding: 0px;
            li{
                display: inline-block;
                font-family: 'Nunito';
                font-size: 1em;
                padding: 5px 20px;
                position: relative;
                &:before{
                    content: '/';
                    display: inline-block;
                    position: absolute;
                    top: 5px;
                    left: 0px;
                }
                &:first-child{
                    &:before{
                        display: none;
                    }
                }
            }
        }
    }
    .operations{
        position: relative;
        display: flex;
        align-items: center;
        ul{
            list-style: none;
            margin: 0px;
            padding: 0px;
            li{
                display: inline-block;
                font-size: 1em;
                padding: 12px 10px 12px 0px;
                position: relative;
                &.search{
                    .rs-input-group{
                        position: relative;
                        overflow: hidden;
                        .rs-btn{
                            position: relative;
                            top: 0px;
                            background-color: black;
                            color: white;
                            .rs-icon{
                                margin-right: 10px;
                            }
                        }
                        .rs-input{
                            transition: all 0.3s;
                            width: 65px;
                            padding-right: 9px;
                        }
                        &.rs-input-group-focus{
                            .rs-input{
                                width: 200px;
                            }
                        }
                    }
                }
                .rs-btn{
                    &.remove{
                        .rs-icon{
                            color: red;
                        }
                    }
                    &.btn-grey{
                        background-color: grey;
                        &:hover{
                            background-color: #a0a0a0;
                        }
                    }
                }
            }
        }
   }
`;	

export default TopPanelStatusStyle;