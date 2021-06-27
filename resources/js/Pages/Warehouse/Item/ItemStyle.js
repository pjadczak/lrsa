import styled from 'styled-components';

const ItemStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .rs-row{
        margin-bottom: 10px;
        .rs-col{
            label{
                display: block;
            }
            .rs-picker-select{
                display: block;
            }
            .rs-picker-date{
                display: block;
            }
            .warehouseName{
                font-weight: bold;
                color: green;
                position: relative;
                top: 8px;
            }
            .onState{
                font-weight: bold;
                color: red;
                position: relative;
                top: 8px;
                &.state-1{
                    color: green;
                }
            }
            table.actions{
                width: 100%;
                border-collapse: collapse;
                thead{
                    background-color: black;
                    tr td{
                        color: white;
                    }
                }
                tr td{
                    padding: 4px 8px;
                }
                tbody{
                    tr{
                        cursor: pointer;
                        td{
                            border: 1px solid #dcdcdc;
                            i.noAction{
                                color: #dad6d6;
                            }
                            i.up{
                                color: green;
                            }
                            i.down{
                                color: red;
                            }
                            &.date{
                                width: 140px;
                            }
                            &.short{
                                width: 40px;
                            }
                        }
                        &:nth-child(even){
                            background-color: #e6e6e6;
                        }
                        &:nth-child(odd){
                            background-color: #efefef;
                        }
                        &:hover{
                            background-color: white;
                        }
                    }
                }
            }
        }
    }
`;	

export default ItemStyle;