import React , { useState, useEffect, useContext } from 'react';
import ArticleStyle from './ArticleStyle';
import api , { prefixUrl } from '../../../actions/api';
import { StateContext } from '../../Front/Front';
import { Row , Col , Input , TagPicker, Icon , InputGroup , Toggle } from 'rsuite';
import { useHistory , useParams } from 'react-router-dom';
import LoadingBlock from '../../../components/LoadingBlock/LoadingBlock';
import Photo from '../../../components/Photo/Photo';
import ContentRow from './ContentRow/ContentRow';
import { alert , correctSlug } from '../../../actions/Functions';

const Article = () => {

    const CONTEXT = useContext(StateContext);
    const history = useHistory();
    const { id } = useParams();

    const [readData,setReadData] = useState(false);
    const [createDefaultContext,setCreateDefaultContext] = useState(false);

    // const [article,setArticle] = useState(null);
    const [categoriesAll,setCategoriesAll] = useState([]);
    const [title,setTitle] = useState('');
    const [photo,setPhoto] = useState('');
    const [content,setContent] = useState([]);
    const [active,setActive] = useState(true);
    const [special,setSpecial] = useState(false);
    const [articleCategories,setArticleCategories] = useState([]);
    const [slug,setSlug] = useState('');
    const [editSlug,setEditSlug] = useState(false);

    const [errTitle,setErrTitle] = useState(false);
    const [errCategory,setErrCategory] = useState(false);
    const [errContent,setErrContent] = useState(false);
    const [errSlug,setErrSlug] = useState(false);

    const [objAddItemCategory,setObjAddItemCategory] = useState({ add: false, value: '' });
    const [addedNewCategories,setAddedNewCategories] = useState([]);

    useEffect(() => {
        CONTEXT.setBread([{ label: 'Articles list', path: prefixUrl+"articles" },{ label: id>0 ? 'Edit article' : 'Adding new article' }]);
        CONTEXT.setLoading(true);
        api('getArticleData/'+id,CONTEXT.userToken,{},r => {
            CONTEXT.setLoading(false);
            if (r.result){
                setCategoriesAll(r.data.categories.map(obj => {
                    return { label: obj.name, value: obj.id }
                }));
                if (r.data.article == null){
                    setCreateDefaultContext(true);
                } else {
                    setTitle(String(r.data.article.title));
                    setPhoto(r.data.article.photo);
                    setContent(JSON.parse(r.data.article.content));
                    setSlug(r.data.article.slug_title);
                    setActive(Boolean(r.data.article.active));
                    setSpecial(Boolean(r.data.article.special));

                    if (id>0){
                        setArticleCategories(r.data.articleCategories.map(obj => obj.category_article_id));
                    } else {
                        setCreateDefaultContext(true);
                        if (r.data.article.categories!=''){
                            setArticleCategories(r.data.article.categories.split(",").map(el => parseInt(el)));
                        }
                    }
                }
            }
            setReadData(true);
        });
        
    },[]);

    const autoSave = () => {
        const dataSave= {
            content,
            title,
            active,
            special,
            photo,
            slug,
            articleCategories
        }

        api('saveArticleAdd',CONTEXT.userToken,dataSave);
    }

    /*
     * Creating actions
     **/
    useEffect(() => {
        CONTEXT.setActions([
            {
                type: 'back',
                action: () => history.push(prefixUrl+"articles")
            },
            {
                type: 'save',
                label: id>0 ? 'Save change' : 'Add new',
                action: saveAction
            },
        ]);

        if (id==0){
            const autoSaveInterval = setInterval(autoSave,5000);
            return () => {
                clearInterval(autoSaveInterval);
            }
        }
    },[content,active,title,special,articleCategories,addedNewCategories,photo,slug]);

    const saveAction = () => {

        const dataSave= {
            content,
            title,
            active,
            special,
            articleCategories,
            addedNewCategories,
            photo,
            slug
        }

        CONTEXT.setLoading(true);
        api('saveArticle/'+id,CONTEXT.userToken,dataSave,r => {
            setReadData(true);
            CONTEXT.setLoading(false);
            if (r.result){
                alert(r.comm,'success');
                setContent(r.data.contentJson);
                setPhoto(r.data.photo);
                if (r.data.newId>0){
                    // hack to reload current component
                    const currentPath = prefixUrl+"articles/"+r.data.newId;
                    history.replace(`${currentPath}/replace`);
                    history.replace(currentPath)
                }
            } else {
                if (r.errors!==undefined){
                    r.errors.forEach(element => {
                        if (element.indexOf('The title field')>=0) setErrTitle(true);
                        if (element.indexOf('category')>=0) setErrCategory(true);
                        if (element.indexOf('slug title')>=0) setErrSlug(true);
                    });
                }
                alert(r.comm,'error');
            }
        });
    }

    const addNewCategoryItem = () => {
        if (objAddItemCategory.label!=''){
            const newId = Math.floor((Math.random() * 1000000) + 100000);

            setCategoriesAll(old => [
                ...old,
                ...[{
                    label: objAddItemCategory.value,
                    value: newId
                }]]);
            setObjAddItemCategory({ add: false, value: '' })
            setAddedNewCategories(old => [
                ...old,
                ...[{
                    label: objAddItemCategory.value,
                    value: newId
                }]]);
        }
    }

    const handleSlugEdit = event => {
        event.preventDefault();
        setEditSlug(v => !v);
        setErrSlug(false);
    }

    if (content == null) return <LoadingBlock />

    return (
        <ArticleStyle>
            <Row>
                <Col md={16}>
                    <Row>
                        <Col>
                            <label>Article's content</label>
                            <div className="content">
                                <ContentRow 
                                    content={content} 
                                    setContent={setContent} 
                                    CONTEXT={CONTEXT} 
                                    createDefaultContext={createDefaultContext}
                                    id={id}
                                />
                            </div>
                            <div className="addRow">
                                
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={8} className="colRight">
                    <Row>
                        <Col className={errTitle ? 'error' : ''}>
                            <label>Title</label>
                            <Input value={title} onChange={v => setTitle(v)} onFocus={() => setErrTitle(false)} />                  
                        </Col>
                    </Row>
                    <Row>
                        <Col className={errCategory ? 'error' : ''}>
                            <label>Article's category</label>
                            <TagPicker 
                                value={articleCategories}
                                data={categoriesAll}
                                placeholder="Select categories"
                                onClean={() => setArticleCategories([])}
                                onChange={data => setArticleCategories(data)}
                                onExit={() => setObjAddItemCategory({ add: false, value: '' })}
                                onOpen={() => setErrCategory(false)}
                                block
                                creatable={true}
                                renderExtraFooter={() => (
                                    <div className="footer">
                                        {!objAddItemCategory.add ?
                                            <a href="" className="addItem" onClick={event => {
                                                event.preventDefault();
                                                setObjAddItemCategory({ add: true, value: '' });
                                            }}><Icon icon="plus-square" /> Add New</a>
                                        :
                                            <InputGroup>
                                                <Input value={objAddItemCategory.value} onKeyDown={event => {
                                                    if (event.keyCode==13){
                                                        addNewCategoryItem()
                                                    }
                                                }} onChange={value => setObjAddItemCategory(obj => {
                                                    return {...obj,...{ value }}
                                                })} />
                                                <InputGroup.Button onClick={() => addNewCategoryItem()}>
                                                    <Icon icon="plus-square-o" />
                                                </InputGroup.Button>
                                            </InputGroup>
                                        }
                                    </div>
                                )}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <label>Active</label>
                            <Toggle checked={active} onChange={v => setActive(v)} size="md" className="green" />
                        </Col>
                        <Col md={12}>
                            <label>Highlighted</label>
                            <Toggle checked={special} onChange={v => setSpecial(v)} size="md" />
                        </Col>
                    </Row>
                    {id>0 &&
                        <Row>
                            <Col className={errSlug ? 'error' : ''}>
                                <label>Slug name url <a href="" onClick={event => handleSlugEdit(event)}><Icon icon={editSlug ? 'lock' : 'unlock'} /></a></label>
                                <Input disabled={!editSlug} value={slug} onChange={text => setSlug(correctSlug(text))} onFocus={() => setErrSlug(false)} />
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <label>Image</label>
                            <Photo 
                                photo={photo}
                                setPhoto={setPhoto}
                                CONTEXT={CONTEXT}
                                urlAppend={'uploadContentPhotoArticle/'+id}
                                urlRemove={'removePhotoArticle/'+photo+'/'+id}
                                height={300}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ArticleStyle>
    );
}
export default Article;