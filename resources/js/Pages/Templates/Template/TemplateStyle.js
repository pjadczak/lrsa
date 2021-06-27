import styled from 'styled-components';

const TemplateStyle = styled.div`
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    header{
        margin-bottom: 20px;
    }
    label{
        display: block;
        text-transform: uppercase;
        .icoInfo{
            color: black;
            display: inline-block;
            float: right;
        }
    }
    .body{
        flex: 1;
        .rs-col{
            &.textarea{
                textarea{
                    max-height: none;
                    background-color: #ececec;
                    transition: all 0.3s;
                    &:focus{
                        background-color: #fbfbfb;
                    }
                }
            }
            .rs-picker-toggle-wrapper{
                display: block;
            }
            &.error{
                label{
                    color: red;
                }
                input{
                    border-color: red;
                    background-color: #FFCFCF;
                }
            }
        }
    }
    .buttonsLayer{
        flex: 1;
        max-height: 36px;
        .rs-row{
            flex-direction: row;
            .searchButton{
                border-radius: 0px !important;
            }
            flex: 1;
        }
        .rs-col{
            flex: 1;
            text-align: right;
            button{
                /* flex: 1; */
                max-width: 160px;
                width: 160px;
                margin-left: 10px;
            }
        }
    }
`;

export default TemplateStyle;