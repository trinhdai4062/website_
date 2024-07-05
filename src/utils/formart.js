export const formatVND=(amount)=> {
    if (isNaN(amount)) {
      return "Invalid amount";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  export const truncate = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };

  export const normalizeFileName = (fileName) => {
    return fileName
      .toLowerCase() 
      .replace(/\s+/g, '-') 
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, ""); 
  };

export const convertToWords = (amount) => {
    const numbers = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const units = ["", "mươi", "trăm"];
    const scales = ["", "nghìn", "triệu", "tỷ"];

    const convertChunk = (chunk) => {
      let result = "";
      for (let i = 0; i < chunk.length; i++) {
        const digit = parseInt(chunk[i]);
        if (chunk.length === 3 && digit === 1 && i === 1) {
            result += "mười ";
        } else if (chunk.length === 2 && digit === 1 && i === 0) {
            result += "mười ";
        } else if (digit !== 0) {
            result += numbers[digit] + " " + units[chunk.length - i - 1] + " ";
        }
    }
      return result.trim();
  };


    const chunks = [];
    while (amount > 0) {
        chunks.push(amount % 1000);
        amount = Math.floor(amount / 1000);
    }

    let result = "";
    for (let i = chunks.length - 1; i >= 0; i--) {
        const chunk = chunks[i];
        if (chunk !== 0) {
            result += convertChunk(chunk.toString()) + " " + scales[i] + " ";
        }
    }

    return result.trim();
};

export const formatPrice = (Price) => {
  const price = String(Price);
  const cleanedPrice = price.replace(/[^0-9.]/g, "");
  const normalizedPrice = cleanedPrice.replace(/\.{2,}/g, ".");
  const parts = normalizedPrice.split(".");
  if (parts[0].startsWith("0")) {
    parts[0] = parts[0].replace(/^0+/, "");
  }
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formattedPrice = parts.join(".");
  return formattedPrice;
};
export const convertToVietnamTime = (utcDateString) => {
  const utcDate = new Date(utcDateString);
  const vietnamTime = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return vietnamTime.toLocaleString('vi-VN', options);
};

  
  