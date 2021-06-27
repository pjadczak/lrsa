import styled from 'styled-components';


const ContentRowStyle = styled.div`
    display: grid;
    flex-direction: column;
    flex: 1;
    .contentRow{
        margin: 15px 0px 15px 0px;
        border: 1px dashed grey;
        padding: 5px;
        position: relative;
        min-height: 300px;
        /* max-height: 300px; */
        display: flex;
        flex-direction: row;
        background-color: #f9f9f9;
        &:hover{
            border-color: black;
        }
        &.contentSingle{
            border: 0px;
            padding: 0px;
            min-height: 360px;
            .toolRow{
                border: 0px;
                background-color: white;
                bottom: -28px;
                right: 0px;
            }
        }
        .contentCol{
            flex: 1;
            background-color: white;
            margin-left: 10px;
            position: relative;
            display: flex;
            max-height: inherit;
            &:nth-child(1){
                margin-left: 0px;
            }
            .photo-box{
                flex: 1;
                height: auto;
            }
            .toolCol{
                position: absolute;
                bottom: 1px;
                left: 1px;
                z-index: 20;
                display: none;
                flex-direction: row;
                .button{
                    flex: 1;
                    color: white;
                    background-color: black;
                    padding:  3px 8px;
                    margin-right: 1px;
                    &.removeCol{
                        color: red;
                    }
                    &:hover{
                        background-color: grey;
                    }
                }
            }
            &:hover{
                .removeCol{
                    display: block;
                }
            }
        }
        .toolRow{
            position: absolute;
            bottom: -29px;
            right: 3px;
            z-index: 20;
            display: none;
            background-color: #f9f9f9;
            border-left: 1px dashed grey;
            border-right: 1px dashed grey;
            border-bottom: 1px dashed grey;
            padding: 3px;
            flex-direction: row;
            ul.Main{
                display: flex;
                flex-direction: row;
                list-style: none;
                margin: 0px;
                padding: 0px;
                li{
                    flex: 1;
                    margin: 0px 0px 0px 3px;
                    padding: 0px;
                    .button{
                        background-color: black;
                        padding:  3px 8px;
                        color: white;
                        &.remove{
                            color: red;
                        }
                        &:hover{
                            background-color: grey;
                        }
                    }
                    &:first-child{
                        margin-left: 0px;
                    }
                    .rs-dropdown .rs-dropdown-toggle button{
                        background-color: black;
                        border-radius: 0px;
                        color: white;
                        height: 22px;
                        padding: 8px 14px;
                        top: -1px;
                        .rs-icon{
                            width: 28px;
                            height: 28px;
                            padding: 0px;
                        }
                    }
                }
            }
        }
        &:hover{
            .toolRow{
                display: block;
            }
        }
        &.showOptions{
            .contentCol{
                .toolCol{
                    display: flex;
                }
            }
        }
    }
`;	

export default ContentRowStyle;