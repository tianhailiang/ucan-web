var Vue = require('/modules/lib/vue.js');
require('/modules/lib/polyfill.min.js');
var axios = require('/modules/lib/axios.js');
var VueRouter =require('/modules/lib/vue-router.js');

require('/modules/css/index.css');

var ElementUI=require('modules/lib/index.js');

Vue.use(ElementUI);

Vue.use(VueRouter);



var flipPage = Vue.extend({
    template: '#flip',
    name: 'flipPage',
    props:['maxPage'],
    data () {
      return {
        currentPage:0,
        nextActive:false,
        preActive:false,
        nextFlag:false,
        preFlag:false
       
        
      }
    },

    watch:{
      maxPage:function(newValue){

       
       
        if(newValue>1){
          
           this.$set(this,'nextActive',true);
           this.$set(this,'nextFlag',true);
        }
        
      }
    },
    

    methods:{

     
      previousPage:function(){
         
         this.currentPage--;
         

         
         if(this.currentPage==0){

             
              console.log('已经是第一页');
              alert('已经是第一页')
              this.$set(this,'nextActive',true);
              this.$set(this,'preActive',false);
              this.$set(this,'preFlag',true);
              this.$set(this,'nextFlag',true);
              
         }else if(this.currentPage>0){
           
           this.$set(this,'preFlag',true);

         }else if(this.currentPage<0){
           this.currentPage=0;
           this.$set(this,'preFlag',false);
         }

         // console.log(this.preFlag +"  点击上一页的开关")

         // console.log(this.currentPage +'  点击上一页的当前页')

         if(this.preFlag){


            this.$emit('flip',this.currentPage);
         }

        
        
      },

      nextPage:function(){
           
          
          this.currentPage++;

        
      
           if(this.nextFlag){
             //设置一个变量开关
              console.log(1000)
              this.$emit('flip',this.currentPage);
          
           };

         
          // console.log(this.currentPage +"  点击下一页的当前页")

          if(this.currentPage==this.maxPage-1){
          
              console.log('已经是最后一页')
              alert('已经是最后一页')

              this.$set(this,'nextActive',false);
              this.$set(this,'preActive',true);
              this.$set(this,'nextFlag',false);

           }else if(this.currentPage>this.maxPage-1){

               this.currentPage=this.maxPage-1;

           }else if(this.currentPage<this.maxPage-1){
             
              this.$set(this,'nextFlag',true);

           }
         
      }

    }



});


var ExquisiteList = Vue.extend({
  template: '#exquisiteList', 
   name: 'schoolList',
    data () {
    return {
      size:4,
      EnglishList:[],
      EnglishRows:[],
      EmaxPage:0,
      ChineseList:[],
      ChineseRows:[],
      CmaxPage:0,
      MathList:[],
      MathRows:[],
      MmaxPage:0,
      OtherList:[],
      OtherRows:[],
      OmaxPage:0
     
     
    }
  },
  components: {
    flipPage
  },
  methods:{

    EnglishChangePage(currentPage){
    	 console.log(currentPage)

    	 this.$set(this,"EnglishRows",this.EnglishList.slice(currentPage*this.size,(currentPage+1)*this.size)); 
    },

    ChineseChangePage(currentPage){
           
        this.$set(this,"ChineseRows",this.ChineseList.slice(currentPage*this.size,(currentPage+1)*this.size)); 
    },
    MathChangePage(currentPage){
       
         this.$set(this,"MathRows",this.MathList.slice(currentPage*this.size,(currentPage+1)*this.size)); 
    },

    OtherChangePage(currentPage){

    	this.$set(this,"OtherRows",this.OtherList.slice(currentPage*this.size,(currentPage+1)*this.size)); 
    }


  },
  mounted:function(){



         //http://localhost:8888/static/mock/school/schoolList.json 

        
         axios.get("http://localhost:8080/getmock/exquisiteClassroom/exquisiteList.json",{
               
             })
            .then(function (response) {

                 
                var result=response.data;

               
                 console.log(result)
                
                if(result.code==0){

                    //英语课程 
                  this.$set(this,'EnglishList',result.data.EnglishCourse);
                  this.$set(this,"EnglishRows",this.EnglishList.slice(0,this.size));
                  this.$set(this,"EmaxPage",Math.ceil(this.EnglishList.length/this.size));
                   
                   //语文课程

                  this.$set(this,'ChineseList',result.data.ChineseCourse);
                  this.$set(this,"ChineseRows",this.ChineseList.slice(0,this.size));
                  this.$set(this,"CmaxPage",Math.ceil(this.ChineseList.length/this.size));

                   //数学课程
                   
                  this.$set(this,'MathList',result.data.MathCourse);
                  this.$set(this,"MathRows",this.MathList.slice(0,this.size));
                  this.$set(this,"MmaxPage",Math.ceil(this.MathList.length/this.size)); 
                   
                   //其它课程

                  this.$set(this,'OtherList',result.data.OtherCourse);
                  this.$set(this,"OtherRows",this.OtherList.slice(0,this.size));
                  this.$set(this,"OmaxPage",Math.ceil(this.OtherList.length/this.size)); 

                }else{

                  console.log(result.msg)
                } 
                
                

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

  }
   
});



//精品课堂回放

var RecordingPlayback = Vue.extend({
  template: '#recording', 
   name: 'recordingPlayback',
    data () {
    return {
       teacherPhoto:'',
       teacherName:'',
       courseList:[],
       source:'',
       type:'',
       dialogVisible: false,
       form: {

          desc: ''
        },

       count:0, 
       flowerList:[false,false,false,false,false],
      

     
    }
  },

  filters:{

  	transChineseNumber:function(val){

		        var Utils={
				   
				    units:'个十百千万@#%亿^&~', // 单位
				  
				    chars:'零一二三四五六七八九', //字符
				    /*
				        数字转中文
				        @number {Integer} 形如123的数字
				        @return {String} 返回转换成的形如 一百二十三 的字符串             
				    */
				    numberToChinese:function(number){
				        var a=(number+'').split(''),s=[],t=this;
				        if(a.length>12){
				            throw new Error('too big');
				        }else{
				            for(var i=0,j=a.length-1;i<=j;i++){
				                if(j==1||j==5||j==9){//两位数 处理特殊的 1*
				                    if(i==0){
				                        if(a[i]!='1')s.push(t.chars.charAt(a[i]));
				                    }else{
				                        s.push(t.chars.charAt(a[i]));
				                    }
				                }else{
				                    s.push(t.chars.charAt(a[i]));
				                }
				                if(i!=j){
				                    s.push(t.units.charAt(j-i));
				                }
				            }
				        }
				        //return s;
				        return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等
				            b=t.units.indexOf(d);
				            if(b!=-1){
				                if(d=='亿')return d;
				                if(d=='万')return d;
				                if(a[j-b]=='0')return '零'
				            }
				            return '';
				        }).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
				            return b;
				        }).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){
				            return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m];
				        }).replace(/([亿万])([一-九])/g,function(m,d,b,c){
				            c=t.units.indexOf(d);
				            if(c!=-1){
				                if(a[j-c]=='0')return d+'零'+b
				            }
				            return m;
				        });
				    }


             }  

  	     return  Utils.numberToChinese(val+1);
  	     
  	}

  },
 
  methods:{

   coursePlay:function(val,type){
      
       this.$set(this,'source',val);
       this.$set(this,'type',type);
      
       
       this.$refs.courseVideo.load(); //重新加载
   },

   scoreCount:function(val){
      
     this.$set(this,'count',val);
     
      this.flowerList.forEach(function(value,index,array){
               
                 array[index]=false;  

       });

     switch(val)
	{
	case 1:
	   this.flowerList.splice(0,1,true)
	  break;
	case 2:
	   this.flowerList.splice(0,2,true,true)
	  break;
	case 3:
	   this.flowerList.splice(0,3,true,true,true)
	  break;
    case 4:
	   this.flowerList.splice(0,4,true,true,true,true)
	  break;

	case 5:
	   this.flowerList.splice(0,5,true,true,true,true,true)
	  break;  

	}

    
     // console.log(this.flowerList)
    

   },

   submitComments:function(){

     

      if(this.form.desc==''){

	      	this.$message({
	          message: '请输入对老师的评论',
	          type: 'warning'
	        });

	       return ;
      }

     if(this.count==0){
         
         	this.$message({
	          message: '请对老师评分',
	          type: 'warning'
	        });

	       return ;  

     }
        

        axios.get("http://localhost:8080/getmock/exquisiteClassroom/RecordingPlayback.json",{

  		      params:{
  		      	courseId:this.$route.params.id,
  		      	desc:this.form.desc,
  		      	scoreCount:this.count
  		      }
               
             })
            .then(function (response) {

              

              var result =response.data;

                
                if(result.code==0){

                	  this.$message({
                            type: 'success',
                            message: '评论成功!'
                       });

                     this.$set(this,'dialogVisible',false); 
                  
                }else{

                      this.$message({
                            type: 'error',
                            message:result.msg
                        });
                } 
                
                

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });

   }

  },
  mounted:function(){

  	 	axios.get("http://localhost:8080/getmock/exquisiteClassroom/RecordingPlayback.json",{

  		      params:{
  		      	courseId:this.$route.params.id
  		      }
               
             })
            .then(function (response) {

              

              var result =response.data;

                
                if(result.code==0){

                   // console.log(result)

                   this.$set(this,'teacherPhoto',result.data.teacherPhoto);
                   this.$set(this,"teacherName",result.data.teacherName);
                   this.$set(this,"courseList",result.data.courseList);
                
                  
                }else{

                  console.log(result.msg)
                } 
                
                

            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });


  }

});





var routes = [
  { path: '/',component:ExquisiteList},
  { path: '/recordingPlayback/:id',
      name:'recordingPlayback',
      component: RecordingPlayback
   }
 
  
]


var router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})




module.exports = {
    init: function () {
    
       var app = new Vue({
            router
           
        }).$mount('#app')

    
   } 	

}    