import styled from 'styled-components';

const Overlay = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1010;
    background-color: rgba(0,0,0,0.7);
    .overlayBg{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 1011;
    }
    .overlay{
        width: 900px;
        min-height: 270px;
        background-color: #f7f7f7;
        overflow: hidden;
        z-index: 1012;
        header{
            color: grey;
            padding: 20px 20px;
            background-color: var(--leftPanelBg);
            color: white;
            margin-bottom: 20px;
            border-bottom: 1px solid grey;
            position: relative;
        }
        .body{
            padding: 30px;
            .buttons{
                padding: 20px 0px 0px 0px;
                text-align: right;
                .close{
                    float: left;
                    margin-right: 10px;
                }
                .remove{
                    float: left;
                    background-color: red;
                }
            }
            .rs-picker-select{
                display: block;
            }
            .rs-col{
                label{
                    transition: all 0.3s;
                }
                &.error{
                    label{
                        color: red;
                    }
                    input , textarea , .rs-picker-select a{
                        border-color: red;
                        background-color: #ffbebe !important;
                    }
                }
                &.content{
                    margin: 10px 0px 0px 0px;
                    border: 1px dashed #d2d2d2;
                    background-color: #e6e6e6;
                    padding: 15px;
                }
            }
            .rs-row.row-table{
                .rs-col{
                    padding-bottom: 3px;
                    position: relative;
                    label{
                        font-size: 12px;
                        color: #a7a7a7;
                    }
                    .value{
                        &.value-mod{
                            color: black;
                        }
                    }
                    &:after{
                        position: absolute;
                        bottom: 0px;
                        width: 95%;
                        height: 1px;
                        background-color: #c1c1c1;
                        content: '';
                        align-self: center;
                    }
                }
            }
        }
    }
`;

export default Overlay;