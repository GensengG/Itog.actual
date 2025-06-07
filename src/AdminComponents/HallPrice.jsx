import "../App.jsx";
import "../App.css";
import { useState } from "react";

// Логин - shfe-diplom@netology.ru
// Пароль - shfe-diplom

export const HallPrice = () => {    
    
    function hideSection(e) {
        e.preventDefault();
        const sectionBody = document.getElementById("hall__price__body");
        sectionBody.classList.toggle("hall__price__body__active");
    }

    let hallsResponse = [];
    let hallArr = [];
    let hallElements = [];
    let hallConfig = [];
    let hallId = 0;
    let [halls, setHalls] = useState();  
    let prices = {
        standart: 0,
        vip: 0,
    }
    let [id, setId] = useState();
    let [priceInfo, setPriceInfo] = useState({standart: 0, vip: 0});
    let [priceInfoFixed, setPriceInfoFixed] = useState({standart: 0, vip: 0});
    
    fetch( 'https://shfe-diplom.neto-server.ru/alldata' )
    .then( response => response.json())
    .then( data => {
            hallsResponse = data.result.halls;
            for (let i = 0; i < hallsResponse.length; i++){
                hallArr.push(hallsResponse[i]["hall_name"])
            }
            hallElements = hallArr.map(item => (
                <button type="button" className = "hall__config__name" onClick={hallNameChecked}>
                {item}
                </button>
            ));
            setHalls(halls = hallElements);
        }  
    );
    
    function hallNameChecked(e) {
        let hallName = e.target.textContent;
        for (let i = 0; i < hallsResponse.length; i++){
            if(hallsResponse[i]["hall_name"] === hallName){
                hallId = hallsResponse[i].id;
                priceInfo.standart = hallsResponse[i]["hall_price_standart"];
                priceInfo.vip = hallsResponse[i]["hall_price_vip"];
                priceInfoFixed.standart = hallsResponse[i]["hall_price_standart"];
                priceInfoFixed.vip = hallsResponse[i]["hall_price_vip"];
                setId(id = hallId);
            }
        };
    }

    let standartPrice = document.getElementById("standartPrice");
    let vipPrice = document.getElementById("vipPrice");

    function changeStandart(e){
        e.preventDefault();
        let newPrice = {};
        newPrice.standart = e.value;
        newPrice.vip = vipPrice.value;
        setPriceInfo(priceInfo = newPrice)
    }

    function changeVip(e){
        e.preventDefault();
        let newPrice = {};
        newPrice.standart = standartPrice.value;
        newPrice.vip = e.value;
        setPriceInfo(priceInfo = newPrice)
    }

    function priceBtnCancel(){
        standartPrice.value = priceInfoFixed.standart;
        vipPrice.value = priceInfoFixed.vip;
    }

    function priceBtnSave(){
        let params = new FormData()
        params.set('priceStandart', Number(standartPrice.value))
        params.set('priceVip', Number(vipPrice.value))
        fetch( `https://shfe-diplom.neto-server.ru/price/${id}`, {
            method: 'POST',
            body: params 
        })
            .then( response => response.json())
    }

    return (
        <>
            <section className = "admin__section">
                <div className = "section__header">
                    <p className = "section__header__name">Конфигурация цен</p>
                    <button className = "section__header__arrow" onClick={hideSection}>
                        <img className = "section__header__arrow__img" src="../section__header__arrow.png"/>
                    </button>
                </div>
                <div className = "hall__price__body active" id = "hall__price__body">
                    <p className="config__text">Выберите зал для конфигурации:</p>
                    <div className = "hall__config__container">
                        {halls}
                    </div>                
                    <div>
                        <p className="price__instruction">Установите цены для типов кресел:</p>
                        <div className = "hall__prices__form">
                            <label for = "standartPrice" className = "label__price">Цена, рублей</label>
                            <input className = "input__price" id = "standartPrice" type="text" value={priceInfo.standart} onChange={changeStandart}></input>
                            <p className="price__text">за</p>
                            <div className = "type__place__standart"></div>
                            <p className="price__text">обычные кресла</p>
                        </div>
                        <div className = "hall__prices__form">
                            <label for = "vipPrice" className = "label__price">Цена, рублей</label>
                            <input className = "input__price" id = "vipPrice" type="text" value={priceInfo.vip} onChange={changeVip}></input>
                            <p className="price__text">за</p>
                            <div className = "type__place__vip"></div>
                            <p className="price__text">VIP кресла</p>
                        </div>
                        <div className = "btn__container">
                            <button className = "btn__cancel" onClick={priceBtnCancel}>Отмена</button>
                            <button className = "btn__save" onClick={priceBtnSave}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HallPrice;
