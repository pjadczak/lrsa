const getDayOfWeek = day => {
    switch (day){
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
 }

 // zamiana na objekt date z formatu stringa YYYY-MM-DD HH:II:SS
export const formatDate = (dateStr, returnDay = false, returnStringDate = false) => {
    const year = dateStr.substr(0,4);
    const month = dateStr.substr(5,2);
    const day = dateStr.substr(8,2);
  
    if (returnDay){
      return year + '-' + zeroFill(month) + '-' + zeroFill(day);
    }
  
    const hour = dateStr.substr(11,2);
    const minute = dateStr.substr(14,2);
    const second = dateStr.substr(17,2);
  
    if (returnStringDate){
      return year + '-' + zeroFill(month) + '-' + zeroFill(day) + ' ' + zeroFill(hour) + ':' + zeroFill(minute) + ':' + zeroFill(second);
    }
  
    return new Date(year,parseInt(month-1),day,hour,minute,second);
  }

export const zeroFill = nr => {
    return parseInt(nr)<=9 ? '0'+parseInt(nr) : nr;
}
  
const timeAgo = dateString => {
    const dateFull = formatDate(dateString);// format daty
    const dateDay = formatDate(dateString,true);// format string YY-MM-DD
  
    const nowDate = new Date();
  
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth()+1;
    const day = nowDate.getDate();
  
    const NowDateStr = year + '-' + zeroFill(month) + '-' + zeroFill(day);
  
    if (dateDay==NowDateStr) {
      return (
        <>
          <span className="datetoday">Today</span> {zeroFill(dateFull.getHours())+':'+zeroFill(dateFull.getMinutes())}
        </>
      )
    } else {
      const dateYesterdayNow = new Date(nowDate.getTime()-(24*60*60*1000));
      const dateYesterday = dateYesterdayNow.getFullYear()+'-'+zeroFill((dateYesterdayNow.getMonth()+1))+'-'+zeroFill(dateYesterdayNow.getDate());
      if (dateYesterday==dateDay){
        return (
          <>
            <span className="date yesterday">Yesterday</span>
            {zeroFill(dateFull.getHours())+':'+zeroFill(dateFull.getMinutes())}
          </>
        );
      } else {
        const time = Math.floor(nowDate.getTime()/1000);
        const timeDate = Math.floor(dateFull.getTime()/1000);
  
        const days = Math.floor((time - timeDate)/(3600*24));
  
        if (days<7){
          return (
            <>
              <span className="date dayOfWeek">{getDayOfWeek(dateFull.getDay())}</span>
              {zeroFill(dateFull.getHours())+':'+zeroFill(dateFull.getMinutes())}
            </>
          );
        } else if (days<30){
            return (
                <>
                    <span className="date dayOfWeek">{days}</span> days ago
                </>
            );
        }
      }
      
    }
    
    return dateDay;
  
  }

  export default timeAgo;