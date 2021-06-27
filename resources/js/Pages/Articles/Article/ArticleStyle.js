import styled from 'styled-components';

const ArticleStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .rs-row{
        margin-bottom: 10px;
        .rs-col{
            label{
                display: block;
                a{
                    display: block;
                    float: right;
                    color: grey;
                    &:hover{
                        color: black;
                    }
                }
            }
            .rs-btn-toggle{
                &.rs-btn-toggle-checked.green{
                    background-color: green;
                }
            }
            &.error{
                label{
                    color: red;
                }
                .rs-input , .rs-picker-input{
                    background-color: #ffcfcf;
                    border: 1px solid red;
                }
            }
        }
    }
    .colRight{
        padding-left: 25px;
        padding-top: 15px;
    }
    .addRow{
        margin: 15px 0px 15px 0px;
    }
`;	

export default ArticleStyle;