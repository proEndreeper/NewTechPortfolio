window.addEventListener("load",function(ev) {
  function createRequest() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
    }
      else
    {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  }
  
  requests = {};
  
  function loadXMLDoc(path) {
    if(requests[path]) return false;
    console.info("Preparing Request for "+path);
    var xmlhttp = createRequest();
    xmlhttp.onload=onDataLoad;
    xmlhttp.open("GET",path,false);
    xmlhttp.send();
    requests[path]=false;
    return true;
  }
  
  loadXMLDoc("data/data.xml");
  
	//HS Freshman
	//loadXMLDoc("data/data-commstud.xml");
	
	// HS Sophomore
  loadXMLDoc("data/data-algebra2.xml");
  loadXMLDoc("data/data-biolit.xml");
  loadXMLDoc("data/data-chemistry.xml");
  loadXMLDoc("data/data-spanish-ii.xml");
  loadXMLDoc("data/data-visual-arts.xml");
  loadXMLDoc("data/data-community-service.xml");
  
  //loadXMLDoc("data/data-web.xml");
  
  function check() {
    for(var x in requests) {
      if(!requests[x]) return false;
    }
    return true;
  }
  
  function checkIfFinished() {
    if(check()) {
      window.setTimeout(finishLoading,10);
    }
  }
  
  function onDataLoad(){
    xmlDoc=this.responseXML;
    var el = xmlDoc.getElementsByTagName("HOME_HTML")[0];
    if(el instanceof Element) setHomeHTML(el.innerHTML);
    el = xmlDoc.getElementsByTagName("ABOUT_HTML")[0];
    if(el instanceof Element) setAboutHTML(el.innerHTML);
    el = xmlDoc.getElementsByTagName("SECTION_NAMES")[0];
    if(el instanceof Element) {
			// TODO Implement Sections
		}
    
    courses = xmlDoc.getElementsByTagName("COURSE");
    var x,i,dfimg_path,title,subtitle,yearR,year,qtr,sect;
    for(x in courses) {
      course=courses[x];
      if(!(course instanceof Element)) continue;
      el = course.getElementsByTagName("SUBTITLE")[0];
      subtitle=el instanceof Element?el.innerHTML:"";
      el = course.getElementsByTagName("YEAR")[0];
      yearR=parseInt(el instanceof Element?el.innerHTML:"0",10);
      year=isNaN(yearR)?0:yearR-1;
      nCourse = addCourse(course.getElementsByTagName("ID")[0].childNodes[0].nodeValue,
                          course.getElementsByTagName("NAME")[0].innerHTML,
                          subtitle,
                          course.getElementsByTagName("DESC")[0].innerHTML,
                          year);
      projects = course.getElementsByTagName("PROJECTS")[0].getElementsByTagName("PROJECT");
      for(i in projects) {
        project=projects[i];
        if(!(project instanceof Element)) continue;
        el = project.getElementsByTagName("TITLE")[0];
        title=el instanceof Element?el.innerHTML:"";
        el = project.getElementsByTagName("SUBTITLE")[0];
        subtitle=el instanceof Element?el.innerHTML:"";
        el = project.getElementsByTagName("IMG")[0];
        img_path=el instanceof Element?el.innerHTML:"";
        el = project.getElementsByTagName("QUARTER")[0];
        qtr=el instanceof Element?el.innerHTML:"1";
        el = project.getElementsByTagName("SECTION")[0];
        sect=el instanceof Element?el.innerHTML:"qt"+qtr;
        nCourse.addProject(qtr,
                           project.getElementsByTagName("ID")[0].childNodes[0].nodeValue,
                           project.getElementsByTagName("NAME")[0].innerHTML,
                           project.getElementsByTagName("HTML")[0].innerHTML,
                           title,
                           subtitle,
                           img_path,
													 sect);
      }
    }
    checkIfFinished();
  }
  
  window.generateDataXml=function(min) {
    var dat = getData(),data="<DATA>";
    data+=(!min?"\n\t":"")+"<HOME_HTML>";
    data+=(!min?"\n":"")+getHomeHTML();
    data+=(!min?"\n\t":"")+"</HOME_HTML>";
    data+=(!min?"\n\t":"")+"<ABOUT_HTML>";
    data+=(!min?"\n":"")+getAboutHTML();
    data+=(!min?"\n\t":"")+"</ABOUT_HTML>";
    data+=(!min?"\n\t":"")+"<COURSES>";
    for(var course_id in dat.courses) {
      course = dat.courses[course_id];
      data+=(!min?"\n\t\t":"")+"<COURSE>";
      data+=(!min?"\n\t\t\t":"")+"<ID>"+course_id+"</ID>";
      data+=(!min?"\n\t\t\t":"")+"<NAME>"+course.name+"</NAME>";
      data+=(!min?"\n\t\t\t":"")+"<DESC>";
      data+=(!min?"\n":"")+course.desc;
      data+=(!min?"\n\t\t\t":"")+"</DESC>";
      data+=(!min?"\n\t\t\t":"")+"<PROJECTS>";
      for(var prj_id in course.projects) {
        project=course.projects[prj_id];
        data+=(!min?"\n\t\t\t\t":"")+"<PROJECT>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<SECTION>"+project.section.replace(course.id+"-","")+"</SECTION>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<QUARTER>"+project.quarter.replace(course.id+"-qt","")+"</QUARTER>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<ID>"+project.id+"</ID>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<NAME>"+project.name+"</NAME>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<TITLE>"+project.title+"</TITLE>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<IMG>"+project.image+"</IMG>";
        data+=(!min?"\n\t\t\t\t\t":"")+"<HTML>";
        data+=(!min?"\n":"")+project.html;
        data+=(!min?"\n\t\t\t\t\t":"")+"</HTML>";
        data+=(!min?"\n\t\t\t\t":"")+"</PROJECT>";
      }
      data+=(!min?"\n\t\t\t":"")+"</PROJECTS>";
      data+=(!min?"\n\t\t":"")+"</COURSE>";
    }
    data+=(!min?"\n\t":"")+"</COURSES>";
    return data+=(!min?"\n":"")+"</DATA>";
  };
});