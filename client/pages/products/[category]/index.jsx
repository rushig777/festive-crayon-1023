import React, { useEffect,useState } from "react";
import axios from 'axios'
import { useRouter, } from 'next/router'
import styles from "../../../styles/products.module.css";
import { ProductsContainer } from "../../../components/Products/ProductsContainer";
import { Filters } from "../../../components/Products/Filters";
import { CategoryS } from "../../../components/Products/CategoryS";
import {useSelector,useDispatch} from "react-redux"
import { GetData } from "../../../redux/action/products.actions";
import Loading from "../../../components/alert/Loading";
import LoadingButton from '@mui/lab/LoadingButton';


const ProductsPage = ({Category}) => {

  const {query} = useRouter()
const dispatch=useDispatch();
  let search = query.category;

  const Range = useSelector((state) => state.ProductReducer.Range);

  const { data, category, isLoading, isError } = useSelector(
    (state) => state.ProductReducer.Data
  );
  

  const [currentSort, setSort] = React.useState("");
  const [Color, setColors] = React.useState(["SelectColor"]);
  const [Size, setSizes] = React.useState(["SelectSize"]);
  const [currentPage,setPage]=useState(1)

  let url=`/products/?category=${query.category}&sortBy=${currentSort}&Color=${Color}&Size=${Size}&MinPrice=${Range[0]}&MaxPrice=${Range[1]}&pageNo=${currentPage}&limit=${12}`

  const handleSort = (event) => {
    setSort(event.target.value);
  };

  const handleColors = (event) => {
    const {
      target: { value },
    } = event;
    setColors(typeof value === "string" ? value.split(",") : value);
  };

  const handleSizes = (event) => {
    const {
      target: { value },
    } = event;
    setSizes(typeof value === "string" ? value.split(",") : value);
  };

  const handlePage=()=>{
    setPage(currentPage+1);
  }

  useEffect(() => {
    dispatch(GetData(url));
  }, [url]);
  return (
    <div className={styles.mainDiv}>
    {isLoading ? (
      <Loading />
    ) : (
      <>
        {isError ? (
          <div></div>
        ) : (
          <>
            <div>
              <div>
                <h1>You searched for “{search}”</h1>
              </div>
              <CategoryS path={query.category} category={Category} />
            </div>
            <Filters
              handleColors={handleColors}
              Color={Color}
              Size={Size}
              handleSizes={handleSizes}
            />
            <ProductsContainer
              data={data}
              handleChange={handleSort}
              currentSort={currentSort}
            />
               <div  onMouseOver={()=>handlePage()} className={styles.Loading}>
              <LoadingButton
                loading
                loadingIndicator="Loading…"
                variant="contained"    
                size="large"   
              >
                Fetch data
              </LoadingButton>
              </div>
          </>
        )}
      </>
    )}
  </div>       
  )
};

export default ProductsPage;


export const getServerSideProps = async (context) => {
  const {category}=context.query
  try{
    let res = await axios.get(`products/category/${category}`);
    let Category=res.data||[]
    return {
      props: {Category}
    };
  }catch(e){
    let Category=[];
    return {
      props: {Category}
    };
  }
  };
  
  
