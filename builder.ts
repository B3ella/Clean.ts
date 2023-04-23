interface IStaticRoutes {
	[key: string]: string;
}

interface IDynamicRoutes {
	[key: string]: {
		file: string;
		func: (arg: string) => { [key: string]: string };
	};
}

export type { IStaticRoutes, IDynamicRoutes };


function dynamicBuilder(){

}

function staticBuilder(){
    
}