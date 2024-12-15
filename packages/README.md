<Select class=" w-200 fs-12" :data="['ddddd','pppp','pppp','pppp','pppp']" v-model="value"></Select>
  
<cascader props="l,v,c" v-model="value" class="h-50" :data="city"></cascader>

<page all color="#ff9900" page="15" total="300"></page>

<Progress :width="600" :value="10"></Progress>

<Switch class="fs-18" open="开启" close="关闭" show v-model="value"></Switch>

<tooltip>fawfeawefawefawe</tooltip>

<tree v-model="value" :getSelectNode="getSelectNode" props="l,v,c" :data="list"></tree>

<idate time twin v-model:end="end" v-model="value" ></idate>

<picker tree class="w-all" props="l,v,c" :data="city" v-model="value"></picker>