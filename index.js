(function(){
  const HASH_MAX = 5; // maximum times to try setting page to hash's page
  const HASH_TIMEOUT = 5; // times between each try

  var LOCALE = {
    YEARS:[
      "HS Freshman",
      "HS Sophomore",
      "HS Junior",
      "HS Senior",
      "College Freshman",
      "College Sophomore",
      "College Junior",
      "College Senior",
      "Other",
	  "Community Service"
    ]
  };
  
  function crEl(tN,id,atts) {
    var el = document.createElement(tN);
    if(id) el.id=id;
    if(atts) {
      for(var key in atts) {
        el.setAttribute(key,atts[key]);
      }
    }
    return el;
  }
  
  function HeaderRowItem(a,b,c) {
    if(a instanceof Element) this.setupFromElement(a);
    else this.setupFromVars(a,b,c);
  }
  
  HeaderRowItem.prototype.setupFromElement=function(el) {
    if(!(el instanceof Element)) return;
    this.itemElement=el;
    this.value=el.innerHTML;
    var nm = el.getAttribute("name");
    if(nm.substring(0,4)=="itm_") {
      this.id=nm.substring(4);
    }
    el.addEventListener("click",this.onClick);
    el.addEventListener("hover",this.onHover);
  };
  
  HeaderRowItem.prototype.onClick=function(ev) {
    if(this.parentAction) this.parentAction();
    if(this.action) this.action(ev,this,"click");
  };
  
  HeaderRowItem.prototype.onMouseOver=function(ev) {
    if(this.parentAction) this.parentAction();
    if(this.action) this.action(ev,this,"mouseover");
  };
  
  HeaderRowItem.prototype.setupFromVars=function(id,txt,action) {
    this.id=id;
    this.action=action;
    this.value=txt;
    this.itemElement = crEl("li",undefined,{name:"itm_"+id});
    var self=this;
    this.itemElement.addEventListener("click",function(ev){self.onClick(ev)});
    this.itemElement.addEventListener("mouseover",function(ev){self.onMouseOver(ev)});
    var link = crEl("a",undefined,{href:"#"+id});
    link.innerHTML=this.value;
    this.itemElement.appendChild(link);
  };
  
  function HeaderRow(el) {
    this.rowElement=el;
    this.setup();
  }
  
  HeaderRow.prototype.clear=function() {
    var item;
    for(var x in this.items) {
      item=this.items[x];
      if(item instanceof HeaderRowItem) {
        item.itemElement.remove();
      }
      this.items[x]=undefined;
    }
  };
  
  HeaderRow.prototype.addItem=function(id,txt,act) {
    if(this.items[id]) return;
    var itm = new HeaderRowItem(id,txt,act);
    itm.parentAction=function(ev) {
      lastev0=ev;
    };
    this.rowElement.appendChild(itm.itemElement);
    this.items[id]=itm;
    return itm;
  };
  
  HeaderRow.prototype.setupItems=function() {
    if(this.items) throw Error("Illegal call");
    this.items={};
    var els = this.rowElement.getElementsByTagName("li"),el,nm;
    for(var x in els) {
      el=els[x];
      if(el instanceof Element) {
        nm=el.getAttribute("name");
        if(typeof(nm)=="string" && nm.substring(0,4)=="itm_") {
          this.items[nm.substring(4)]=new HeaderRowItem(el);
        }
      }
    }
  };
  
  HeaderRow.prototype.setup=function() {
    this.setupItems();
  };
  
  function HeaderManager(el) {
    this.managerElement=el;
    this.setup();
  }
  
  HeaderManager.prototype.setupRows=function() {
    if(this.rows) throw Error("Illegal call");
    this.rows={};
    var els = this.managerElement.getElementsByClassName("row"),el,nm;
    for(var x in els) {
      el=els[x];
      if(el instanceof Element) {
        nm=el.getAttribute("name");
        if(typeof(nm)=="string" && nm.substring(0,3)=="row") {
          this.rows[nm.substring(3)]=el;
        }
      }
    }
  };
  
  HeaderManager.prototype.setup=function() {
    this.setupRows();
  };
  
  HeaderManager.prototype.getRow=function(ind) {
    return new HeaderRow(this.rows[ind.toString()]);
  };
  
  // END OF HEADER MANAGER
  var _DATA = {
    current:{
      course:null,
      quarter:null,
      project:null,
      section:null
    },
    courses:{},
    coursesByYear:[{},{},{},{},{},{},{},{},{},{}],
    projects:{},
    projectsByQuarter:{}
  };
  
  function generateCourseMap(course_id) {
    var course = _DATA.courses[course_id];
    if(!course) return "Page Not Found!";
    var gen_html = "";
    // TITLE
      //gen_html+="<h1>"+course.name+"</h1>";
    // BODY
      if(course.desc.length>0)
        gen_html+="<p>"+course.desc+"</p>";
      var projects,x,project;
      if(countProjects(course_id+"-qt1")>0) {
        gen_html+="<h3><a name='"+course_id+"-qt1'>Quarter 1</a></h3>";
        gen_html+="<ul>";
        projects = _DATA.projectsByQuarter[course_id+"-qt1"];
        for(x in projects) {
          project=projects[x];
          gen_html+='<li><a href="#'+project.ref+'">'+project.name+'</a></li>';
        }
        gen_html+="</ul>";
      }
      if(countProjects(course_id+"-qt2")>0) {
        gen_html+="<h3><a name='"+course_id+"-qt2'>Quarter 2</a></h3>";
        gen_html+="<ul>";
        projects = _DATA.projectsByQuarter[course_id+"-qt2"];
        for(x in projects) {
          project=projects[x];
          gen_html+='<li><a href="#'+project.ref+'">'+project.name+'</a></li>';
        }
        gen_html+="</ul>";
      }
      if(countProjects(course_id+"-qt3")>0) {
        gen_html+="<h3><a name='"+course_id+"-qt3'>Quarter 3</a></h3>";
        gen_html+="<ul>";
        projects = _DATA.projectsByQuarter[course_id+"-qt3"];
        for(x in projects) {
          project=projects[x];
          gen_html+='<li><a href="#'+project.ref+'">'+project.name+'</a></li>';
        }
        gen_html+="</ul>";
      }
      if(countProjects(course_id+"-qt4")>0) {
        gen_html+="<h3><a name='"+course_id+"-qt4'>Quarter 4</a></h3>";
        gen_html+="<ul>";
        projects = _DATA.projectsByQuarter[course_id+"-qt4"];
        for(x in projects) {
          project=projects[x];
          gen_html+='<li><a href="#'+project.ref+'">'+project.name+'</a></li>';
        }
        gen_html+="</ul>";
      }
    return gen_html;
  }
  
  function generateQuarterMap(course_id) {
    var gen_html = "(";
    if(countProjects(course_id+"-qt1")>0)
      gen_html+=" <a href='#"+course_id+"-qt1'>Q1</a>";
    
    if(countProjects(course_id+"-qt2")>0)
      gen_html+=" <a href='#"+course_id+"-qt2'>Q2</a>";
    
    if(countProjects(course_id+"-qt3")>0)
      gen_html+=" <a href='#"+course_id+"-qt3'>Q3</a>";
    
    if(countProjects(course_id+"-qt4")>0)
      gen_html+=" <a href='#"+course_id+"-qt4'>Q4</a>";
    
    gen_html+=" )";
    return gen_html;
  }
  
  function generateSectionMap(pages) {
    var gen_html = "";
    gen_html+="<p>Click one of the courses from above or below to view that course.</p>";
    var page_id,page_name,prj_id;
    for(page_id in pages) {
      page_name = pages[page_id];
      if(typeof(page_name)=="string") {
        gen_html+='<h3><a href="#'+page_id+'">'+page_name+"</a> "+generateQuarterMap(page_id)+"</h3>";
      }
    }
    return gen_html;
  }
  
  function countCourses(yr) {
    var course,count=0;
    for(var id in _DATA.coursesByYear[yr]) {
      course=_DATA.courses[id];
      if(course instanceof Course &&
         course.year==yr)
            count++;
    }
    return count;
  }
  
  function countProjects(qt) {
    var project,count=0;
    for(var id in _DATA.projects) {
      project=_DATA.projects[id];
      if(project instanceof CourseProject &&
         project.quarter==qt)
            count++;
    }
    return count;
  }
  
  function CourseProject(course,qtr,id,name,html,title,subtitle,img) {
    this.parent=course;
    this.quarter=qtr;
    this.id=id;
    this.ref=this.parent.id+"-prj_"+this.id;
    this.name=name;
    this.html=html;
    this.title=title;
    this.subtitle=subtitle;
    this.image=img;
    _DATA.projects[this.ref]=this;
    _DATA.projectsByQuarter[this.quarter][this.id]=this;
    course.projects[id]=this;
  }
  
  CourseProject.prototype.getParent=function() {
    return this.parent;
  };
  
  CourseProject.prototype.handler=function(ev,itm,act) {
    if(act=="click") {
      if(_DATA.current.project==itm.id || !(_DATA.projects[itm.id] instanceof CourseProject)) return;
      _DATA.current.project=itm.id;
      console.log("Project: "+itm.id);
      var prj = _DATA.projects[itm.id];
      setTitle(prj.parent.name+" - "+prj.name+" | Portfolio |");
      setActive(3,prj.ref);
      var wasContentHidden = mainContentEl.getAttribute("hide")=="true";
      mainContentEl.setAttribute("hide","true");
			window.setTimeout(function(){
				updateSidebar();
				setContent(prj.html);
				setContentTitle(prj.title);
				setContentStub(prj.subtitle,prj.image);
        window.setTimeout(function() {
        	mainContentEl.setAttribute("hide","false");
        },wasContentHidden?0:1000);
			},1000);
    }
  };
  
  function Course(course_id,course_name,subtitle,desc,year) {
    this.name=course_name;
    this.id=course_id;
    this.subtitle=subtitle;
    this.desc=desc;
    this.projects={};
    this.year=typeof(year)=="number" && year>-1 && year<10?year:0;
    this.setup();
    _DATA.coursesByYear[this.year][this.id]=this.name;
    _DATA.courses[this.id]=this;
    _DATA.projectsByQuarter[this.id+"-qt1"]={};
    _DATA.projectsByQuarter[this.id+"-qt2"]={};
    _DATA.projectsByQuarter[this.id+"-qt3"]={};
    _DATA.projectsByQuarter[this.id+"-qt4"]={};
  }
  
  Course.prototype.setup=function() {
    if(!window._hm) return;
    //var courseRow = _hm.getRow(1);
    //courseRow.addItem(this.id,this.name,courseHandler);
  };
  
  Course.prototype.addProject=function(quarter,project_id,project_name,html,title,subtitle,image) {
    return new CourseProject(this,this.id+"-qt"+quarter,project_id,project_name,html,title,subtitle,image);
  };
  
  // END OF COURSE MANAGER
  
  function courseHandler(ev,itm,act) {
    if(!window._hm) return;
    var quarterRow = _hm.getRow(2),projectRow = _hm.getRow(3);
    if(act=="click") {
      if(_DATA.current.course==itm.id && _DATA.current.quarter===null && _DATA.current.project===null) return;
      _DATA.current.course=itm.id;
      _DATA.current.quarter=null;
      _DATA.current.project=null;
      quarterRow.clear();
      projectRow.clear();
      console.log("Showing quarters for "+itm.id);
      
      if(countProjects(itm.id+"-qt1")>0)
        quarterRow.addItem(itm.id+"-qt1","Quarter 1",quarterHandler);
      if(countProjects(itm.id+"-qt2")>0)
        quarterRow.addItem(itm.id+"-qt2","Quarter 2",quarterHandler);
      if(countProjects(itm.id+"-qt3")>0)
        quarterRow.addItem(itm.id+"-qt3","Quarter 3",quarterHandler);
      if(countProjects(itm.id+"-qt4")>0)
        quarterRow.addItem(itm.id+"-qt4","Quarter 4",quarterHandler);
      
      quarterRow.rowElement.setAttribute("hidden",false);
      projectRow.rowElement.setAttribute("hidden",true);
      updateSidebar();
      setTitle(itm.value+" | Portfolio |");
      setActive(1,itm.id);
      var wasContentHidden = mainContentEl.getAttribute("hide")=="true";
      mainContentEl.setAttribute("hide","true");
      var course_map = generateCourseMap(itm.id);
      window.setTimeout(function(){
        setContent(course_map);
        setContentTitle(itm.value);
        if(!(attempting.quarter || attempting.page)) setContentStub(_DATA.courses[itm.id].subtitle,null);
        window.setTimeout(function() {
          mainContentEl.setAttribute("hide","false");
        },wasContentHidden?0:1000);
      },1000);
    }
  }
  
  function quarterHandler(ev,itm,act) {
    if(!window._hm) return;
    var projectRow = _hm.getRow(3);
    if(act=="click" && _DATA.projectsByQuarter[itm.id]!==undefined) {
      if(_DATA.current.quarter==itm.id) return;
      _DATA.current.quarter=itm.id;
      _DATA.current.project=null;
      setActive(2,itm.id);
      console.log("Showing projects for "+itm.id);
      projectRow.clear();
      var projects = _DATA.projectsByQuarter[itm.id],nItem,first=null;
      for(var x in projects) {
        if(!(projects[x] instanceof CourseProject)) continue;
        nItem = projectRow.addItem(projects[x].ref,projects[x].name,projects[x].handler);
        if(!first) first=nItem;
      }
      if(first instanceof HeaderRowItem) {
        window.setTimeout(function(){
          if(_DATA.current.project===null && _DATA.current.quarter!==null && first.itemElement instanceof Element) first.itemElement.click();
        },2000);
      }
      projectRow.rowElement.setAttribute("hidden",false);
    }
  }
  
  function sectionHandler(ev,itm,act) {
    var courseRow = _hm.getRow(1),qtrRow = _hm.getRow(2),prjRow = _hm.getRow(3);
    if(act=="click") {
      if(itm.id=="home") return homeHandler(ev,itm,act);
      if(itm.id=="about") return aboutHandler(ev,itm,act);
      if(_DATA.current.section==itm.id && _DATA.current.course===null && _DATA.current.quarter===null && _DATA.current.project===null) return;
      _DATA.current.section=itm.id;
      _DATA.current.course=null;
      _DATA.current.quarter=null;
      _DATA.current.project=null;
      courseRow.clear();
      qtrRow.clear();
      prjRow.clear();
      var pages = {},hndlr = null;
      if(itm.id.substring(0,3)=="sch") {
        console.info("Pages");
        var ind = parseInt(itm.id.substring(3),10);
        pages = _DATA.coursesByYear[ind];
        hndlr = courseHandler;
      }
      var page_id,page_name;
      for(page_id in pages) {
        page_name = pages[page_id];
        if(typeof(page_name)!="string") {
          console.error("Invalid page!",page_id,page_name);
          continue;
        }
        console.info("Page:",page_id,page_name);
        courseRow.addItem(page_id,page_name,hndlr);
      }
      if(courseRow.items.length<1) {
        console.error("No pages were added!");
        return;
      }
      updateSidebar();
      courseRow.rowElement.setAttribute("hidden",false);
      qtrRow.rowElement.setAttribute("hidden",true);
      prjRow.rowElement.setAttribute("hidden",true);
      setActive(0,itm.id);
      setTitle(itm.value+" | Portfolio |");
      var wasContentHidden = mainContentEl.getAttribute("hide")=="true";
      mainContentEl.setAttribute("hide","true");
      window.setTimeout(function(){
        setContentTitle(itm.value);
        if(!(attempting.course || attempting.quarter || attempting.project))setContentStub(null,null);
        setContent(generateSectionMap(pages));
        window.setTimeout(function() {
          mainContentEl.setAttribute("hide","false");
        },wasContentHidden?0:1000);
      },1000);
    }
  }
  
  var homeHTML=null;
  
  function homeHandler(ev,itm,act) {
    if(!window._hm) return;
    var courseRow = _hm.getRow(1),qtrRow = _hm.getRow(2),prjRow = _hm.getRow(3);
    if(act=="click") {
      if(_DATA.current.section==itm.id) return;
      if(!(attempting.page || attempting.quarter || attempting.project)) setContentStub(null,null);
      setActive(0,"home");
      _DATA.current.section=itm.id;
      _DATA.current.course=null;
      _DATA.current.quarter=null;
      _DATA.current.project=null;
      var wasContentHidden = mainContentEl.getAttribute("hide")=="true";
      mainContentEl.setAttribute("hide","true");
      mainContentEl.setAttribute("hideSidebar","true");
      var wasHidden = prjRow.rowElement.getAttribute("hidden")=="true";
      prjRow.rowElement.setAttribute("hidden","true");
      window.setTimeout(function(){
        mainContentEl.setAttribute("hide","true");
        prjRow.clear();
        var wasQtrHidden = qtrRow.rowElement.getAttribute("hidden")=="true";
        qtrRow.rowElement.setAttribute("hidden","true");
        window.setTimeout(function(){
          qtrRow.clear();
          var wasCourseHidden = courseRow.rowElement.getAttribute("hidden")=="true";
          courseRow.rowElement.setAttribute("hidden","true");
          window.setTimeout(function(){
            courseRow.clear();
            setTitle("Home | Portfolio |");
            setContentTitle("Home");
            setContent(homeHTML);
            if(setupSidebar()) mainContentEl.setAttribute("hideSidebar","false");
            window.setTimeout(function() {
              mainContentEl.setAttribute("hide","false");
            },wasContentHidden?0:1000);
          },wasCourseHidden?0:1000);
        },wasQtrHidden?0:750);
      },wasHidden?0:500);
      
    }
  }
  
  var aboutHTML=null;
  
  function aboutHandler(ev,itm,act) {
    if(!window._hm) return;
    var courseRow = _hm.getRow(1),qtrRow = _hm.getRow(2),prjRow = _hm.getRow(3);
    if(act=="click") {
      if(_DATA.current.section==itm.id) return;
      if(!(attempting.page || attempting.quarter || attempting.project)) setContentStub(null,null);
      setActive(0,"about");
      _DATA.current.section=itm.id;
      _DATA.current.course=null;
      _DATA.current.quarter=null;
      _DATA.current.project=null;
      var wasContentHidden = mainContentEl.getAttribute("hide")=="true";
      mainContentEl.setAttribute("hide","true");
      mainContentEl.setAttribute("hideSidebar","true");
      var wasHidden = prjRow.rowElement.getAttribute("hidden")=="true";
      prjRow.rowElement.setAttribute("hidden","true");
      window.setTimeout(function(){
        mainContentEl.setAttribute("hide","true");
        prjRow.clear();
        var wasQtrHidden = qtrRow.rowElement.getAttribute("hidden")=="true";
        qtrRow.rowElement.setAttribute("hidden","true");
        window.setTimeout(function(){
          qtrRow.clear();
          var wasCourseHidden = courseRow.rowElement.getAttribute("hidden")=="true";
          courseRow.rowElement.setAttribute("hidden","true");
          window.setTimeout(function(){
            courseRow.clear();
            setTitle("About Me | Portfolio |");
            setContentTitle("About Me");
            setContent(aboutHTML);
            if(setupSidebar()) mainContentEl.setAttribute("hideSidebar","false");
            window.setTimeout(function() {
              mainContentEl.setAttribute("hide","false");
            },wasContentHidden?0:1000);
          },wasCourseHidden?0:1000);
        },wasQtrHidden?0:750);
      },wasHidden?0:500);
      
    }
  }
  
  window.addCourse=function(course_id,course_name,course_subtitle,course_desc,course_year) {
    return new Course(course_id,course_name,course_subtitle,course_desc,course_year);
  };
  
  window.getData=function() {
    return _DATA;
  };
  
  var validCourses = [];
  
  function genProjectListItem(ref,title,img) {
    return  (typeof(ref)=="string"?"<a href='#"+ref+"'>":"<span>")+
              "<span class='subtitle'>"+title+"</span>"+
              (typeof(img)=="string"?
              "<div class='image'>"+
                "<img src='"+img+"'>"+
              "</div>":
              "")+
            (typeof(ref)=="string"?"</a>":"</span>");
  }
  
  function setupSidebar() {
    projectListEl.innerHTML="";
    if(_DATA.current.section.substring(0,3)=="sch") {
      if(_DATA.current.course===null) {
        projectListHeaderEl.innerHTML="Courses";
        var ind = parseInt(_DATA.current.section.substring(3));
        var id,name,courses = _DATA.coursesByYear[ind];
        for(id in courses) {
          name = courses[id];
          projectListEl.innerHTML+=genProjectListItem(id,name,null);
        }
        return true;
      } else {
        if(_DATA.current.quarter===null) {
          projectListHeaderEl.innerHTML="Quarters";
          var course = _DATA.courses[_DATA.current.course];
          if(!(course instanceof Course)) return false;
          if(countProjects(course.id+"-qt1")>0)
            projectListEl.innerHTML+=genProjectListItem(course.id+"-qt1",
                                                        "Quarter 1",
                                                        null);
          if(countProjects(course.id+"-qt2")>0)
            projectListEl.innerHTML+=genProjectListItem(course.id+"-qt2",
                                                        "Quarter 2",
                                                        null);
          if(countProjects(course.id+"-qt3")>0)
            projectListEl.innerHTML+=genProjectListItem(course.id+"-qt3",
                                                        "Quarter 3",
                                                        null);
          if(countProjects(course.id+"-qt4")>0)
            projectListEl.innerHTML+=genProjectListItem(course.id+"-qt4",
                                                        "Quarter 4",
                                                        null);
          return true;
        } else {
          projectListHeaderEl.innerHTML="Projects";
          if(countProjects(_DATA.current.quarter)<1) return false;
          var x,project,projects = _DATA.projectsByQuarter[_DATA.current.quarter];
          var b0=2;
          for(x in projects) {
            project = projects[x];
            if(!(project instanceof CourseProject) || project.ref==_DATA.current.project) {
              b0=1;
              continue;
            }
            if(b0==2) {
              b0=0;
              projectListEl.innerHTML+=genProjectListItem(null,"<b>Previous</b>",null);
            } else if(b0===1) {
              b0=0;
              projectListEl.innerHTML+=genProjectListItem(null,"<b>Up Next</b>",null);
            }
            projectListEl.innerHTML+=genProjectListItem(project.ref,project.name,"img/"+project.image);
          }
          return true;
        }
      }
    } else {
      projectListHeaderEl.innerHTML="Years";
      for(var i=0,c;i<validCourses.length;i++) {
        c=validCourses[i];
        projectListEl.innerHTML+=genProjectListItem("sch"+c,LOCALE.YEARS[c],null);
      }
      return true;
    }
    return false;
  }
  
  function updateSidebar() {
    if(!(projectListEl instanceof Element) || attempting.sidebar) return;
    attempting.sidebar=true;
    var wasHidden = mainContentEl.getAttribute("hideSidebar")=="true";
    mainContentEl.setAttribute("hideSidebar","true");
    window.setTimeout(function() {
      if(setupSidebar()) mainContentEl.setAttribute("hideSidebar","false");
      attempting.sidebar=false;
    },wasHidden?0:1000);
  }
  
  function setActive(row,ref) {
    if(!window._hm) return;
    var r = _hm.getRow(row);
    if(r instanceof HeaderRow) {
      for(var x in r.items) {
        if(r.items[x] instanceof HeaderRowItem &&
           r.items[x].itemElement instanceof Element) {
          r.items[x].itemElement.setAttribute("active",x==ref);
        }
      }
    }
  }
  
  var contentEl = null,mainContentEl = null,contentTitleEl = null,contentSubTitleEl = null,contentImageEl = null,projectListHeaderEl = null,projectListEl = null;
  
  function setContent(html) {
    if(contentEl instanceof Element) contentEl.innerHTML = html;
    else throw Error("contentEl is not a valid element!");
  }
  
  function setContentTitle(html) {
    if(contentTitleEl instanceof Element) contentTitleEl.innerHTML = html;
    else throw Error("contentTitleEl is not a valid element!");
  }
  
  function animContentSubTitle_(html,newState) {
    if(!(contentSubTitleEl instanceof Element) || attempting.subtitle) return;
    var prevState = contentSubTitleEl.getAttribute("hidden");
    if(typeof(html)!="string") html=contentSubTitleEl.innerHTML;
    if(prevState==newState && prevState=="false") {
      console.info("Triggering SubTitle Re-animation!");
      attempting.subtitle=true;
      contentSubTitleEl.setAttribute("hidden","true");
      window.setTimeout(function() {
        console.info("SubTitle Reset!");
        contentSubTitleEl.innerHTML=html;
        window.setTimeout(function() {
          contentSubTitleEl.setAttribute("hidden","false");
          attempting.subtitle=false;
        },450);
      },750);
    } else if(prevState!=newState) {
      console.info("SubTitle State: "+newState);
      contentSubTitleEl.innerHTML=html;
      contentSubTitleEl.setAttribute("hidden",newState);
    }
  }
  
  function animContentSubTitle(html,newState,timeout) {
    if(typeof(timeout)!="number" || timeout<1) {
      animContentSubTitle_(html,newState);
    } else {
      window.setTimeout(function() {
        animContentSubTitle_(html,newState);
      },timeout);
    }
  }
  
  function setContentSubTitle(html,timeout) {
    if(!(contentSubTitleEl instanceof Element)) return;
    if(typeof(html)=="string" && html.length>0) {
      animContentSubTitle(html,"false",timeout);
    } else {
      animContentSubTitle(null,"true",timeout);
    }
  }
  
  function animContentImage_(path,newState) {
    if(!(contentImageEl instanceof Element) || attempting.image) return;
    var prevState = contentImageEl.getAttribute("hidden");
    if(typeof(path)!="string") path=contentImageEl.src;
    if(prevState==newState && prevState=="false") {
      console.info("Triggering Image Re-animation!");
      attempting.image=true;
      contentImageEl.setAttribute("hidden","true");
      window.setTimeout(function() {
        console.info("Image Reset!");
        contentImageEl.src=path;
        window.setTimeout(function() {
          contentImageEl.setAttribute("hidden","false");
          attempting.image=false;
        },450);
      },750);
    } else if(prevState!=newState) {
      console.info("Image State: "+newState);
      contentImageEl.src=path;
      contentImageEl.setAttribute("hidden",newState);
    }
  }
  
  function animContentImage(path,newState,timeout) {
    if(typeof(timeout)!="number" || timeout<1) {
      animContentImage_(path,newState);
    } else {
      window.setTimeout(function() {
        animContentImage_(path,newState);
      },timeout);
    }
  }
  
  function setContentImage(path,timeout) {
    if(!(contentImageEl instanceof Element)) return;
    if(typeof(path)=="string" && path.length>0) {
      animContentImage("img/"+path,"false",timeout);
    } else {
      console.log("No Picture!");
      animContentImage(null,"true",timeout);
    }
  }
  
  function setContentStub(html,path) {
    /*
    var state0,state1,b0,b1;
  
    state0 = contentSubTitleEl.getAttribute("hidden")=="true"?true:false;
    state1 = contentImageEl.getAttribute("hidden")=="true"?true:false;
    
    b0=!state0 || state1;
    b1=state0 || !state1;*/
    
    setContentSubTitle(html,0);
    setContentImage(path,0);
    //console.log(html,path);
  }
  
  function setTitle(t) {
    document.title=t;
  }
  
  var attempting={page:false,course:false,quarter:false,project:false,image:false,subtitle:false,sidebar:false};
  
  function changePage(page,callback) {
    var count = 0;
    var pageRow = _hm.getRow(0);
    function _changePage() {
      if(pageRow.items[page] instanceof HeaderRowItem)  {
        pageRow.items[page].itemElement.click();
        attempting.page=false;
        if(typeof(callback)=="function") callback(true);
      } else {
        if(count++<HASH_MAX) {
          window.setTimeout(_changePage,HASH_TIMEOUT);
        } else {
          console.error("Failed to change page to "+page);
          attempting.page=false;
          if(typeof(callback)=="function") callback(false);
        }
      }
    }
    _changePage();
  }
  
  function changeCourse(course,callback) {
    var count = 0;
    var courseRow = _hm.getRow(1);
    function _changeCourse() {
      if(courseRow.items[course] instanceof HeaderRowItem)  {
        courseRow.items[course].itemElement.click();
        attempting.course=false;
        if(typeof(callback)=="function") callback(true);
      } else {
        if(count++<HASH_MAX) {
          window.setTimeout(_changePage,HASH_TIMEOUT);
        } else {
          console.error("Failed to change course to "+course);
          attempting.course=false;
          if(typeof(callback)=="function") callback(false);
        }
      }
    }
    _changeCourse();
  }
  
  function changeQuarter(quarter,callback) {
    var count = 0;
    var quarterRow = _hm.getRow(2);
    function _changeQuarter() {
      if(quarterRow.items[quarter] instanceof HeaderRowItem)  {
        quarterRow.items[quarter].itemElement.click();
        attempting.quarter=false;
        if(typeof(callback)=="function") callback(true);
      } else {
        if(count++<HASH_MAX) {
          window.setTimeout(_changeQuarter,HASH_TIMEOUT);
        } else {
          console.error("Failed to change quarter to "+quarter);
          attempting.quarter=false;
          if(typeof(callback)=="function") callback(false);
        }
      }
    }
    _changeQuarter();
  }
  
  function changeProject(project,callback) {
    var count = 0;
    var projectRow = _hm.getRow(3);
    function _changeProject() {
      if(projectRow.items[project] instanceof HeaderRowItem)  {
        projectRow.items[project].itemElement.click();
        attempting.project=false;
        if(typeof(callback)=="function") callback(true);
      } else {
        if(count++<HASH_MAX) {
          window.setTimeout(_changeProject,HASH_TIMEOUT);
        } else {
          console.error("Failed to change project to "+project);
          attempting.project=false;
          if(typeof(callback)=="function") callback(false);
        }
      }
    }
    _changeProject();
  }
  
  function changeTo(page,course,quarter,project) {
    if(attempting.page || attempting.quarter || attempting.project) throw Error("Attempted to change location while already changing pages!");
    attempting.page=true;
    changePage(page,typeof(course)=="string"?function(success) {
      if(!success) return;
      attempting.course=true;
      changeCourse(course,typeof(quarter)=="string"?function(success) {
        if(!success) return;
        attempting.quarter=true;
        changeQuarter(quarter,typeof(project)=="string"?function(success) {
          if(!success) return;
          attempting.project=true;
          changeProject(project);
        }:null);
      }:null);
    }:null);
  }
  
  function hashHandler() {
    var hash = window.location.hash.toString().substring(1);
    //console.log("Hash Update: "+hash);
    if(hash.length===0) return false;
    var pos0 = hash.indexOf("-"),pos1;
    var courseRow = _hm.getRow(0),quarterRow = _hm.getRow(1),projectRow = _hm.getRow(2);
    var page,course,ext,quarter,project;
    if(pos0>-1) {
      course=hash.substring(0,pos0);
      if(_DATA.courses[course] instanceof Course) {
        page="sch"+_DATA.courses[course].year;
        ext=hash.substring(pos0+1);
        quarter=hash;
        if(ext.substring(0,4)=="prj_") {
          project=hash;
          quarter=_DATA.projects[project].quarter;
        }
      } else {
        page=hash;
        course=null;
      }
    } else {
      course=hash;
      if(_DATA.courses[course] instanceof Course) {
        page="sch"+_DATA.courses[course].year;
      } else {
        page=hash;
        course=null;
      }
    }
    changeTo(page,course,quarter,project);
    return true;
  }
  
  window.setHomeHTML=function(html) {
    homeHTML=html;
  };
  
  window.getHomeHTML=function(){
    return homeHTML;
  };
  
  window.setAboutHTML=function(html) {
    aboutHTML=html;
  };
  
  window.getAboutHTML=function(){
    return aboutHTML;
  };
  
  window.finishLoading=function() {
    var pgRow = _hm.getRow(0);
    for(var i=0;i<_DATA.coursesByYear.length;i++) {
      if(!(_DATA.coursesByYear[i] instanceof Object) ||
         countCourses(i)<1) continue;
      validCourses.push(i);
      pgRow.addItem("sch"+i,LOCALE.YEARS[i],sectionHandler);
    }
    loadingThingie=document.getElementById("loading-thing");
    loadingThingie.setAttribute("visible",false);
    window.setTimeout(function(){
      loadingThingie.style.display="none";
    },500);
    if(!hashHandler()) pgRow.items.home.itemElement.click();
    window.addEventListener("hashchange",hashHandler);
  };
  
  window.addEventListener("load",function() {
    contentEl = document.getElementById("body");
    contentTitleEl = document.getElementById("contentTitle");
    contentSubTitleEl = document.getElementById("contentSubtitle");
    contentImageEl = document.getElementById("contentImage");
    mainContentEl = document.getElementById("mainContent");
    projectListEl = document.getElementById("projectList");
    projectListHeaderEl = document.getElementById("projectListHeader");
    window._hm=new HeaderManager(document.getElementById("mainHeader"));
    _hm.getRow(0).addItem("home","Home",sectionHandler);
    _hm.getRow(0).addItem("about","About Me",sectionHandler);
  });
  
  
})();