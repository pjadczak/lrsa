import styled from 'styled-components';

const ProfileStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    .rs-row{
        margin-bottom: 10px;
        .rs-col{
            .rs-picker-select{
                display: block;
            }
            .loginData{
                padding: 20px;
                background-color: var(--colorWhiteLight);
                margin-top: 20px;
                border: 1px solid #d1d1d1;
                .rs-input-group{
                    border-bottom-left-radius: 0px;
                    border-top-left-radius: 0px;
                }
                .rs-input{
                    background-color: var(--colorGreyLight);
                    border-bottom-left-radius: 0px;
                    border-top-left-radius: 0px;
                    &:focus{
                        background-color: #8c8b8b;
                        color: white;
                    }
                }
            }
            label , .rs-input{
                transition: all 0.3s;
            }
            label a{
                float: right;
                color: grey;
                &:hover{
                    color: black;
                }
            }
            &.error{
                label{
                    color: red;
                }
                .rs-input{
                    background-color: #ffcfcf;
                    border: 1px solid red;
                }
            }
        }
    }
`;

export default ProfileStyle;