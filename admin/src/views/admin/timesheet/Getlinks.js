/* eslint-disable prettier/prettier */

const Getlinks = (pageNumber,data) => {
  var preLink = "";
  var nexLink = "";
  var prepagenumber = 0;
  var nexpagenumber = 0;
  var prePageindex = false;
  var nexPageindex = false;

  if(pageNumber == 0){
    prePageindex = false
    if(data.length > parseInt(pageNumber)+1){
      nexPageindex = true
      nexpagenumber = parseInt(pageNumber)+1
      nexLink = data && data[nexpagenumber]['id']
    }
  }else{
    if(data.length == parseInt(pageNumber)+1){
      prePageindex = true
      nexPageindex = false
      prepagenumber = parseInt(pageNumber)-1
      preLink = data && data[prepagenumber]['id']
    }else{
      prePageindex  = true
      nexPageindex = true
      prepagenumber = parseInt(pageNumber)-1
      nexpagenumber = parseInt(pageNumber)+1
      preLink = data && data[prepagenumber]['id']
      nexLink = data && data[nexpagenumber]['id']
    }
  }

  return {preLink:preLink,nexLink:nexLink,prepagenumber:prepagenumber,nexpagenumber:nexpagenumber,prePageindex:prePageindex,nexPageindex:nexPageindex};
}
export default Getlinks
