import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UISliceReducerState {
  allTodos:any;
  data: string[];
  loading: boolean;
  token:string | null;
  sideBarActiveTab:number;
  theme:{
    dark:boolean
  },
  currentPage:string;
  isMobSidebarOpen:boolean;
}

const initialState: UISliceReducerState = {
  allTodos:null,
  data: [],
  loading: false,
  token:null,
  sideBarActiveTab:0,
  theme:{
    dark:false
  },
  currentPage:'',
  isMobSidebarOpen:false
};

const UISliceReducer = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    setToken(state,action:PayloadAction<string>) {
      state.token = action.payload;
      let isTokenPresent = localStorage.getItem('Token');
      if(!isTokenPresent){
        localStorage.setItem('Token',action.payload);
      }else{
        localStorage.removeItem('Token');
        localStorage.setItem('Token',action.payload);
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAllTodos(state,action:PayloadAction<any>){
      state.allTodos = action.payload;
    },
    UILogout(state){
      state.allTodos = [];
      state.data = [];
      state.loading = false;
      state.sideBarActiveTab = 0;
      state.token = null;
    },
    toogleDarkLight(state){
      if(state.theme.dark){
        localStorage.setItem('darkMode','False')
      }else{
        localStorage.setItem('darkMode','True')
      }
      state.theme.dark = !state.theme.dark;
    },
    setDarkMode(state,action:PayloadAction<any>){
      state.theme.dark = action.payload;
    },
    setCurrentPage(state,action:PayloadAction<string>){
      state.currentPage = action.payload;
    },
    toggleMobSidebar(state){
      state.isMobSidebarOpen = !state.isMobSidebarOpen;
    },
    setSideBarActiveTab(state,action:PayloadAction<number>){
      state.sideBarActiveTab = action.payload
    }
  },
});

export const { setToken, setLoading,setAllTodos ,UILogout,toogleDarkLight,setDarkMode,setCurrentPage,toggleMobSidebar,setSideBarActiveTab} = UISliceReducer.actions;
export default UISliceReducer.reducer;
