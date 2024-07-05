export function stringToSlug(str: string): string {
    str = str.toLowerCase(); // Chuyển đổi tất cả các ký tự thành chữ thường
    str = str.replace(/^\s+|\s+$/g, '_'); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
    str = str.replace(/[^a-zA-Z0-9.]/g, '_'); // Loại bỏ các ký tự không phải là chữ cái, số, dấu gạch ngang và dấu cách
    str = str.replace(/\s+/g, '_'); // Thay thế dấu cách bằng dấu gạch ngang
    str=str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return str;
}

export function convertVietnamTimeToUTC(time:Date): Date {
    // const now = new Date(time);
  
    const vietnamOffset = 7 * 60 * 60 * 1000; // Đổi thành mili giây

    // Điều chỉnh thời gian sang múi giờ UTC
    const utcTime = new Date(time.getTime() - vietnamOffset);
  
    return utcTime;
  }