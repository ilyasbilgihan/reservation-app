import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
} from 'react-native-reanimated';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '../ui/text';
import { Iconify } from '~/lib/icons/Iconify';
import { getSectorItem } from '~/utils/getLabels';

import { Service } from '~/app/(other)/reservation/[id]';

const FirstStep = ({ branch, reservationData, setField }: any) => {
  return (
    <View className="h-full">
      
      <View className="flex-1">
        <ScrollView>
          {branch ? (
            <View className="pb-24">
              <View className="gap-3.5 p-7">
                <Animated.Text
                  entering={FadeInUp.duration(500)}
                  exiting={FadeOutLeft.duration(500)}
                  className="text-4xl capitalize">
                  {getSectorItem(branch?.sector)?.singular} Seçimi
                </Animated.Text>
                <View className="gap-3.5">
                  {branch?.asset.length > 0 ? (
                    branch?.asset.map((item: any, index: number) => {
                      return (
                        <TouchableOpacity
                          activeOpacity={0.75}
                          key={item.id}
                          onPress={() => setField('asset', item)}>
                          <Animated.View
                            entering={FadeInRight.delay(index * 200).duration(500)}
                            exiting={FadeOutLeft.duration(500)}
                            style={
                              reservationData.asset === item
                                ? { backgroundColor: 'hsl(260 51% 41%)' }
                                : {}
                            }
                            className="rounded-lg border border-input bg-background p-3.5">
                            <Text
                              style={
                                reservationData.asset === item ? { color: 'rgb(237 233 254)' } : {}
                              }>
                              {item.name}
                            </Text>
                          </Animated.View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Animated.View
                      exiting={FadeOut.duration(500)}
                      entering={FadeIn.delay(0).duration(500)}
                      className="items-center gap-4 p-7">
                      <Iconify
                        icon="solar:ghost-bold-duotone"
                        size={48}
                        className="text-slate-400"
                      />
                      <Text className="text-center text-muted-foreground">
                        <Text className="capitalize">
                          {getSectorItem(branch?.sector)?.singular}
                        </Text>
                        <Text>
                          {' '}
                          bulunamadı. İşletme henüz hazır değil ya da bir şeyler yanlış gitti.
                          Lütfen işletmeyle iletişime geçiniz.
                        </Text>
                      </Text>
                    </Animated.View>
                  )}
                </View>
              </View>
              <View className="gap-3.5 p-7">
                <Animated.Text
                  entering={FadeInUp.duration(500)}
                  exiting={FadeOutLeft.duration(500)}
                  className="text-4xl capitalize">
                  Hizmet Seçimi
                </Animated.Text>
                <Animated.View
                  entering={FadeInLeft.duration(500)}
                  exiting={FadeOutLeft.duration(500)}>
                  <Text>
                    Süre sınırlaması olmadan rezervasyon almak istiyorsanız hizmet seçmeyiniz.
                  </Text>
                </Animated.View>
                <View className="gap-3.5">
                  {branch?.service.length > 0 ? (
                    branch?.service.map((item: any, index: number) => {
                      let exist = reservationData.services.find((r: any) => r.id === item.id);
                      return (
                        <TouchableOpacity
                          activeOpacity={0.75}
                          key={item.id}
                          onPress={() => {
                            if (!exist) {
                              setField('services', [...reservationData.services, item]);
                            } else {
                              setField(
                                'services',
                                reservationData.services.filter((x: Service) => x.id !== item.id)
                              );
                            }
                          }}>
                          <Animated.View
                            entering={FadeInRight.delay(index * 200).duration(500)}
                            exiting={FadeOutLeft.duration(500)}
                            style={
                              reservationData.services.includes(item)
                                ? { backgroundColor: 'hsl(260 51% 41%)' }
                                : {}
                            }
                            className="flex-row justify-between rounded-lg border border-input bg-background p-3.5">
                            <Text
                              style={
                                reservationData.services.includes(item)
                                  ? { color: 'rgb(237 233 254)' }
                                  : {}
                              }>
                              {item.name}
                            </Text>
                            {item.time_span > 0 ? (
                              <Text
                                style={
                                  reservationData.services.includes(item)
                                    ? { color: 'rgb(237 233 254)' }
                                    : {}
                                }>
                                {item.time_span * branch?.reservation_period} dk
                              </Text>
                            ) : null}
                          </Animated.View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Animated.View
                      exiting={FadeOut.duration(500)}
                      entering={FadeIn.delay(0).duration(500)}
                      className="items-center gap-4 p-7">
                      <Iconify
                        icon="solar:ghost-bold-duotone"
                        size={48}
                        className="text-slate-400"
                      />
                      <Text className="text-center text-muted-foreground">
                        Bu işletme herhangi bir ekstra hizmet sunmuyor.
                      </Text>
                    </Animated.View>
                  )}
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
};

export default FirstStep;
