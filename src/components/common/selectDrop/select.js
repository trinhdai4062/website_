import React, { useEffect, useState } from "react";
import "./select.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { FamilyRestroomTwoTone } from "@mui/icons-material";

const Select = ({ data, placeholder, icon,onSelect }) => {
  const [isOpenSelect, setisOpenSelect] = useState(false);
  const [selectedIndex, setselectedIndex] = useState(0);
  const [selectedItem, setselectedItem] = useState(placeholder);

  const [listData, setListData] = useState();
  const [listData2, setListData2] = useState();


  useEffect(() =>{
    setListData(data)
    setListData2(data)
  },[data])

  const openSelect = () => {
    setisOpenSelect(!isOpenSelect);
  };

  const closeSelect = (index,id, name) => {
    setselectedIndex(index);
    setisOpenSelect(false);
    setselectedItem(name);
    onSelect(id);
  };

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    const list = listData2.filter((item) => {
      return item.name.toLowerCase().includes(keyword);
    });

    const list2 = list.filter((item, index) => list.indexOf(item) === index);

    setListData(list2);
  };

  return (
    <ClickAwayListener onClickAway={() => setisOpenSelect(false)}>
      <div className="selectDropWrapper cursor position-relative">
        {icon}
        <span className="openSelect" onClick={openSelect}>
          {selectedItem.length > 14
            ? selectedItem.substr(0, 14) + "..."
            : selectedItem}
          <KeyboardArrowDownIcon className="arrow" />
        </span>
        {isOpenSelect === true && (
          <div className="selectDrop">
            <div className="searchField">
              <input
                type="text"
                placeholder="Search here..."
                onChange={filterList}
              />
            </div>
            <ul className="searchResults">
              <li
                key={0}
                onClick={() => closeSelect(0, placeholder)}
                className={`${selectedIndex === 0 ? "active" : ""}`}
              >
                {placeholder}
              </li>
              {listData.map((item, index) => {
                return (
                  <li key={index+1} onClick={() => closeSelect(index+1, item.id,item.name)} className={`${selectedIndex === index+1 ? 'active' : ''}`}>{item.name}</li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Select;
