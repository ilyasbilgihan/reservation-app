import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Iconify } from '~/lib/icons/Iconify';
import { Text } from './ui/text';

const ListBranches = ({ branches }: any) => {
  return (
    <>
      {branches?.length > 0 ? (
        <View className="gap-7 p-7">
          <Text className="text-2xl">Bu sektördeki sana en yakın işletmeler</Text>

          {branches.map((item: any) => {
            let now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let working_hour = item?.working_hour.find(
              (wh: any) => wh.day == new Date().toLocaleString('en-us', { weekday: 'long' })
            );
            let is_open = working_hour?.opening < now && now < working_hour?.closing;
            let distance =
              item.dist_meters >= 1000
                ? (item.dist_meters / 1000).toFixed(1) + ' km'
                : item.dist_meters.toFixed(0) + ' m';
            return (
              <TouchableOpacity key={item.id} activeOpacity={0.75}>
                <View
                  style={{
                    shadowColor: 'rgba(20,20,20,0.20)',
                    elevation: 20,
                    shadowOffset: { width: 0, height: 10 },
                    shadowRadius: 13.16,
                  }}
                  className="flex-row gap-3.5 overflow-hidden rounded-3xl bg-white p-3.5">
                  <Image
                    source={
                      item?.thumbnail ? { uri: item?.thumbnail } : require('~/assets/no-image.png')
                    }
                    style={{ borderRadius: 10 }}
                    className="h-44 w-36"
                  />
                  <View className="flex-1 gap-1 pb-2">
                    <View className="flex-row items-center">
                      <View className="flex-row items-center gap-1">
                        <Iconify icon="solar:star-bold" size={22} className="text-amber-400" />
                        <Text className="font-qs-semibold">5.0</Text>
                      </View>
                      {is_open ? (
                        <Text
                          style={{ lineHeight: 16 }}
                          className="ml-auto rounded-lg bg-emerald-400 px-3.5 py-1.5 font-qs-semibold text-sm text-emerald-50">
                          Şuan açık
                        </Text>
                      ) : (
                        <Text
                          style={{ lineHeight: 16 }}
                          className="ml-auto rounded-lg bg-slate-400 px-3.5 py-1.5 font-qs-semibold text-sm text-slate-100">
                          Kapalı
                        </Text>
                      )}
                    </View>
                    <View className="flex-1 justify-center">
                      <Text numberOfLines={3} className="font-qs-semibold text-2xl leading-6">
                        {item.name}
                      </Text>
                    </View>
                    <View className="gap-1">
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="solar:clock-circle-line-duotone"
                          size={18}
                          className="text-slate-500"
                        />
                        <Text style={{ lineHeight: 16 }} className=" text-slate-500">
                          {working_hour?.opening} - {working_hour?.closing}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Iconify
                          icon="game-icons:path-distance"
                          size={18}
                          className="text-slate-500"
                        />
                        <Text style={{ lineHeight: 16 }} className=" text-slate-500">
                          {distance}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View className="items-center gap-4 p-12">
          <Iconify icon="solar:ghost-bold-duotone" size={48} className="text-slate-400" />
          <Text className="text-center text-muted-foreground">
            Bu sektörde hizmet veren işletme bulunamadı. Lütfen konum seçin veya başka bir sektör
            deneyin.
          </Text>
        </View>
      )}
    </>
  );
};

export default ListBranches;
