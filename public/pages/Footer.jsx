import React from 'react'
import {usePhim} from '../component/PhimContext'
import { Link  } from 'react-router-dom';

export default function Footer() {
    const { phim } = usePhim();
  return (
    <div className="inner">
      <p className="ft_ttl">Bộ Sưu Tập</p>
      <ul className="ft_list">
        {[...phim] 
            .reverse()
            .sort((a) =>  a.view)
            .slice(0, 8) 
            .map((p) => (
                <li className="item pic_hv" key={p.id}>
                    <Link to={`/XemPhim/${p.slug}/tap-1`} className='pic'><img src={p.image || "https://placehold.co/600x400/444/FFF?text=Dummy"} alt={p.title} /></Link>
                </li>
        ))}
      </ul>
    </div>
  )
}
