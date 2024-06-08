import { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { HiDotsVertical } from "react-icons/hi";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { IoIosTimer } from "react-icons/io";

const DashboardBox = ({ color, icon, grow, data, onTimeRangeChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTimeRangeChange = (range) => {
        onTimeRangeChange(range);
        handleClose();
    };

    return (
        <Button className="dashboardBox" style={{
            backgroundImage: `linear-gradient(to right, ${color[0]} , ${color[1]})`
        }}>
            <span className="chart">
                {grow ? <TrendingUpIcon /> : <TrendingDownIcon />}
            </span>
            <div className="d-flex w-100">
                <div className="col1">
                    <h4 className="text-white mb-0">{data?.[0]}</h4>
                    <span className="text-white">{data?.[1]}</span>
                </div>
                <div className="ml-auto">
                    <span className="icon">{icon}</span>
                </div>
            </div>
            <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Last Month</h6>
                <div className="ml-auto">
                    <Button className="ml-auto toggleIcon" onClick={handleClick}><HiDotsVertical /></Button>
                    <Menu
                        className="dropdown_menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleTimeRangeChange('lastDay')}>
                            <IoIosTimer /> Last Day
                        </MenuItem>
                        <MenuItem onClick={() => handleTimeRangeChange('lastWeek')}>
                            <IoIosTimer /> Last Week
                        </MenuItem>
                        <MenuItem onClick={() => handleTimeRangeChange('lastMonth')}>
                            <IoIosTimer /> Last Month
                        </MenuItem>
                        <MenuItem onClick={() => handleTimeRangeChange('lastYear')}>
                            <IoIosTimer /> Last Year
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </Button>
    );
};

export default DashboardBox;
