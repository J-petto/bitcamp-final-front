import FormFileIcon from "../components/FormFileIcon";
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { SelectProvider } from '../components/SelectProvider';
import { TitleProvider } from "../components/TitleProvider";

function FormStyles() {
    return (
        <>
            <TitleProvider children={
                <h5 data-title='h5'>제목</h5>
            } />

            <InputProvider>
                <input />
            </InputProvider>

            <InputProvider>
                <label htmlFor="checkbox01" data-label="checkbox">
                    <input
                        type='checkbox'
                        defaultChecked='checked'
                        id='checkbox01'
                        name='체크체크' />
                    <span data-input="text">체크해라</span>
                </label>
            </InputProvider>

            <InputProvider>
                <label htmlFor="checkbox02" data-label="checkbox">
                    <input
                        type='checkbox'
                        id='checkbox02'
                        name='체크체크' />
                    <span data-input="text">체크하지마러라</span>
                </label>
            </InputProvider>

            <InputProvider>
                <label htmlFor="radio01" data-label="radio">

                    <input
                        type='radio'
                        defaultChecked='checked'
                        id='radio01'
                        name='라디오' />
                    <span data-input="text">라디오버튼이여</span>

                </label>
            </InputProvider>

            <InputProvider>
                <label htmlFor="radio02" data-label="radio">
                    <input
                        type='radio'
                        id='radio02'
                        name='라디오' />
                    <span data-input="text">라디오버튼이여</span>
                </label>
            </InputProvider>

            <InputProvider>
                <input
                    type='text'
                    defaultValue='텍스트를 작성하는건? value'
                    id='text01'
                    name='텍수투'
                    placeholder='title' />
            </InputProvider>

            <InputProvider>
                <input
                    type='password'
                    id='pwd01'
                    name='패수워드'
                    placeholder='비밀번호' />
            </InputProvider>

            <InputProvider>
                <input
                    type='email'
                    id='email01'
                    name='이메일'
                    defaultValue='test@test.com'
                    placeholder='이메일입력' />
            </InputProvider>

            <InputProvider>
                <label htmlFor="file01" data-label="file">
                    <input type='file' id="file01" />
                    <FormFileIcon />
                </label>
            </InputProvider>

            <InputProvider>
                <textarea
                    id='textarea01'
                    placeholder='내용 입력'
                ></textarea>
            </InputProvider>

            <ButtonProvider>
                <button type="button" data-button='primary'>
                    <span data-button="text" className="button__text">등록</span>
                </button>
            </ButtonProvider>

            <ButtonProvider>
                <button type="button" data-button='whiteRed'>
                    <span data-button="text" className="button__text">삭제</span>
                </button>
            </ButtonProvider>

            <ButtonProvider width={'130'}>
                <button type="button" data-button='whiteRed'>
                    <span data-button="text" className="button__text">삭제</span>
                </button>
            </ButtonProvider>

            <SelectProvider>
                <select id="select01" name="selectName">
                    <option value={'0'}>선택해라</option>
                    <option value={'1'}>2021</option>
                    <option value={'2'}>2022</option>
                    <option value={'3'}>2023</option>
                </select>
            </SelectProvider>
        </>
    )
}

export default FormStyles;