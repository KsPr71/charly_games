const GameYearTriangle = ({ year,  className = "" }: { year: string, className?: string }) => {
    return (
      <div className={`relative ${className}`}>
        {/* Contenedor triangular con año */}
        <div 
          className="
            absolute top-0 left-0
            w-[60px] h-[60px]
            bg-white
            flex items-start justify-start
            pt-5 pl-5
            shadow
          "
          style={{
            clipPath: 'polygon(0 0, 0% 100%, 100% 0)',
            zIndex: 10
          }}
        >
          <span 
            className="
              block
              font-bold text-xs
              text-fuchsia-900
              w-[40px]
            "
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'left bottom'
            }}
          >
            {year as string}
          </span>
        </div>
        
      </div>
    );
  };
  
  export default GameYearTriangle;